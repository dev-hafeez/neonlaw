// app/api/posts/route.ts
import { NextResponse } from 'next/server';

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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

const QUERY = `
  query Posts($first:Int!, $after:String, $search:String, $catIn:[ID]) {
    posts(
      first: $first
      after: $after
      where: {
        search: $search
        categoryIn: $catIn
        orderby: { field: DATE, order: DESC }
      }
    ) {
      pageInfo { endCursor hasNextPage }
      nodes {
        id
        title
        slug
        excerpt
        date
        featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        categories { nodes { name slug databaseId } }
      }
    }
  }
`;

export async function GET(req: Request) {
  const url = new URL(req.url);

  const first = Number(url.searchParams.get('limit') ?? 18) || 18;
  const after = url.searchParams.get('cursor');
  const search = (url.searchParams.get('q') ?? '').trim();

  // support cats=55,58
  const catsParam = url.searchParams.get('cats') ?? '';
  const catIn = catsParam
    ? catsParam.split(',').map(s => s.trim()).filter(Boolean)
    : null;

  try {
    const { data } = await wpFetch(QUERY, {
      first,
      after: after || null,
      search: search || null,
      catIn,
    });
    if (!data?.posts) {
      return NextResponse.json({ error: 'No posts' }, { status: 404 });
    }
    return NextResponse.json(data.posts, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=86400' },
    });
  } catch (err) {
    // serve last good result if we have one
    if (lastGood?.data?.posts) {
      return NextResponse.json(lastGood.data.posts, {
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
