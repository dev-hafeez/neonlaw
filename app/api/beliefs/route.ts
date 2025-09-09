import { NextResponse } from "next/server";
import { wpFetch } from "@/lib/api/fetcher";

export const runtime = "nodejs";
export const revalidate = 60;

const FIELDS = `
  slug
  title
  beliefFields { teaserPrefix teaserTitle }
  featuredImage { node { sourceUrl altText } }
`;

const QUERY = `
  query Beliefs($first:Int!, $after:String) {
    beliefs(first:$first, after:$after, where:{orderby:{field: DATE, order: DESC}}) {
      pageInfo { endCursor hasNextPage }
      nodes { ${FIELDS} }
    }
  }
`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const first = Number(url.searchParams.get("limit") ?? 24) || 24;
  const after = url.searchParams.get("cursor");

  const { data } = await wpFetch(QUERY, { first, after });
  if (!data?.beliefs) {
    return NextResponse.json({ error: "No beliefs" }, { status: 404 });
  }
  return NextResponse.json(data.beliefs, {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=86400" },
  });
}
