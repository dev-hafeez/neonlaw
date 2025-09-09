import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 300;

const WP = process.env.WP_GRAPHQL_ENDPOINT!;

/** Order + allow-list of category slugs for the People mega menu */
const ORDERED_SLUGS = [
  "corporate",
  "disputes",
  "finance",
  "ma",
  "notarial-service",
  "private-equity",
  "real-estate",
  "tax",
  "tech-data",
  "venture-capital",
  "people-culture",
  "operations",
  "marketing",
] as const;

type CatSlug = (typeof ORDERED_SLUGS)[number];

const QUERY = `
  query PeopleMenuAll($first:Int!) {
    people(
      first:$first
      where:{ status:PUBLISH, orderby:{ field: TITLE, order: ASC } }
    ) {
      nodes {
        title
        slug
        categories { nodes { name slug } }
      }
    }
  }
`;

async function wp<T = any>(query: string, variables?: Record<string, any>): Promise<T> {
  if (!WP) throw new Error("Missing WP_GRAPHQL_ENDPOINT");
  const res = await fetch(WP, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate },
  });
  const json = await res.json();
  if (json?.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limitPerCat = Math.min(Number(url.searchParams.get("limit") ?? 16), 50);

  try {
    // 1) Pull all People (cap to a reasonable upper bound, e.g. 500)
    const { people } = await wp<{ people: { nodes: any[] } }>(QUERY, { first: 500 });
    const nodes = people?.nodes ?? [];

    // 2) Group into the allowed/ordered categories
    const orderIdx = Object.fromEntries(ORDERED_SLUGS.map((s, i) => [s, i]));
    const map: Record<string, { name: string; slug: string; people: { title: string; slug: string }[] }> = {};

    for (const p of nodes) {
      const person = { title: String(p?.title ?? ""), slug: String(p?.slug ?? "") };
      const cats = p?.categories?.nodes ?? [];

      for (const c of cats) {
        const slug = String(c?.slug ?? "");
        if (!(slug in orderIdx)) continue; // only include configured slugs

        const name = String(c?.name ?? slug);
        if (!map[slug]) map[slug] = { name, slug, people: [] };

        map[slug].people.push(person);
      }
    }

    // 3) Build the final array in the configured order, trim per-category
    const categories = ORDERED_SLUGS
      .map((slug) => map[slug])
      .filter(Boolean)
      .map((cat) => ({
        ...cat!,
        people: cat!.people
          .sort((a, b) => a.title.localeCompare(b.title))
          .slice(0, limitPerCat),
      }));

    return NextResponse.json(
      { categories },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=86400" } }
    );
  } catch (e: any) {
    return NextResponse.json(
      { categories: [], error: String(e).slice(0, 300) },
      { status: 200 }
    );
  }
}
