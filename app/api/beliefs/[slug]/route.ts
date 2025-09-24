import { NextResponse } from "next/server";
import { wpFetch } from "@/lib/api/fetcher";

export const runtime = 'nodejs';
export const revalidate = 30;

const BELIEF_QUERY = /* GraphQL */ `
  query BeliefBySlug($slug: ID!) {
    belief(id: $slug, idType: SLUG) {
      title
      slug
      beliefFields { 
        teaserPrefix 
        teaserTitle 
        heroTitle 
        introLeft 
        introRight 
      }
      featuredImage { node { sourceUrl altText } }
    }
  }
`;

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  try {
    const { data } = await wpFetch(BELIEF_QUERY, { slug });
    if (!data?.belief) {
      return NextResponse.json({ error: 'Belief not found' }, { status: 404 });
    }
    return NextResponse.json(data.belief, {
      headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=86400' },
    });
  } catch (err) {
    console.error('Error fetching individual belief:', err);
    return NextResponse.json({ error: 'Failed to fetch belief', detail: String(err) }, { status: 500 });
  }
}
