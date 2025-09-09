import { NextResponse } from 'next/server';
import { GraphQLClient, gql } from 'graphql-request';

const wp = new GraphQLClient(process.env.WP_GRAPHQL_ENDPOINT!);

const CATEGORIES = gql`
  { categories(first:100){ nodes{ id databaseId name slug count } } }
`;

type Cats = { categories:{ nodes:{ id:string; databaseId:number; name:string; slug:string; count:number }[] } };

export const runtime = 'edge';

export async function GET() {
  try {
    const { categories } = await wp.request<Cats>(CATEGORIES);
    return NextResponse.json(categories.nodes, {
      headers: { 'Cache-Control':'s-maxage=300, stale-while-revalidate=86400' }
    });
  } catch {
    return NextResponse.json([], { status:200 });
  }
}
