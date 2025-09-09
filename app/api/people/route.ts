import { NextResponse } from "next/server";

export const runtime = 'nodejs';
export const revalidate = 30;

type WPJson = { data?: any; errors?: any };
const WP = process.env.WP_GRAPHQL_ENDPOINT!;

// keep last good payload to serve if WP times out
let lastGood: any | null = null;

async function wpFetch(query: string, variables: Record<string, any>, timeoutMs = 8000, tries = 3): Promise<WPJson> {
  let lastErr: any;
  for (let attempt = 1; attempt <= tries; attempt++) {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(WP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables }),
        signal: ctrl.signal,
      });
      clearTimeout(to);
      const json = (await res.json()) as WPJson;
      if (json.errors) throw new Error(JSON.stringify(json.errors));
      lastGood = json; // cache last success in memory
      return json;
    } catch (e) {
      clearTimeout(to);
      lastErr = e;
      // small backoff
      await new Promise(r => setTimeout(r, 250 * attempt));
    }
  }
  throw lastErr;
}

const FIELDS = `
  id title slug excerpt
  featuredImage { node { sourceUrl altText } }
  peopleFields { 
    position email linkedin office featured weight 
    introLeft introRight
    headshot { node { sourceUrl altText } }
  }
  categories { nodes { name slug databaseId } }
`;

const QUERY = `
  query People($first:Int!, $after:String, $catIn:[ID], $search:String) {
    people(
      first: $first
      after: $after
      where: {
        categoryIn: $catIn
        search: $search
        orderby: { field: TITLE, order: ASC }
      }
    ) {
      pageInfo { endCursor hasNextPage }
      nodes { ${FIELDS} }
    }
  }
`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const first = Number(url.searchParams.get("limit") ?? 18) || 18;
  const after = url.searchParams.get("cursor");
  const search = (url.searchParams.get("q") ?? "").trim();
  const catSlug = url.searchParams.get("cat"); // e.g. finance

  // Resolve categoryId lazily if slug provided
  let catIn: string[] | null = null;
  if (catSlug) {
    try {
      const { data } = await wpFetch(
        `query($slug:ID!){ category(id:$slug, idType: SLUG){ databaseId } }`,
        { slug: catSlug }
      );
      const id = data?.category?.databaseId;
      if (id) catIn = [String(id)];
    } catch (err) {
      console.error("Failed to resolve category:", err);
    }
  }

  try {
    const { data } = await wpFetch(QUERY, {
      first,
      after: after || null,
      catIn,
      search: search || null,
    });
    
    if (!data?.people) {
      return NextResponse.json({ error: 'No people' }, { status: 404 });
    }
    
    return NextResponse.json(data.people, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=86400' },
    });
  } catch (err) {
    // serve last good result if we have one
    if (lastGood?.data?.people) {
      return NextResponse.json(lastGood.data.people, {
        headers: {
          'Cache-Control': 's-maxage=5, stale-while-revalidate=86400',
          'x-stale': '1',
        },
      });
    }
    // bubble the error
    return NextResponse.json({ error: 'WP timeout', detail: String(err) }, { status: 500 });
  }
}
