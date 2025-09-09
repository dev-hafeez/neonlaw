import { NextResponse } from "next/server";
const WP = process.env.WP_GRAPHQL_ENDPOINT!;

const CATEGORY_QUERY = `
query GetCategories {
  categories(first: 100) {
    nodes {
      slug
      categoryId
    }
  }
}`;

const PEOPLE_QUERY = `
query GetPeople($search: String, $categoryIn: [ID]) {
  people(first: 6, where: {search: $search, categoryIn: $categoryIn}) {
    nodes {
      title
      slug
      categories {
        nodes {
          slug
        }
      }
    }
  }
}`;

const POSTS_QUERY = `
query GetPosts($search: String, $categoryIn: [ID]) {
  posts(first: 6, where: {search: $search, categoryIn: $categoryIn}) {
    nodes {
      title
      slug
      categories {
        nodes {
          slug
        }
      }
    }
  }
}`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const rawCats = searchParams.get("cats") || "";
  const limit = parseInt(searchParams.get("limit") || "6", 10);
  const rawSlugs = rawCats.split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  const includePeople = rawSlugs.includes("people");

  // Step 1: Get all categoryId by slug
  let catMap = new Map();
  try {
    const res = await fetch(WP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: CATEGORY_QUERY }),
    });
    const json = await res.json();
    for (let node of json.data?.categories?.nodes || []) {
      catMap.set(node.slug, node.categoryId);
    }
  } catch (err) {
    return NextResponse.json({ ok: false, error: "Failed to fetch categories" });
  }

  const catIds = rawSlugs
    .filter(s => s !== "people")
    .map(slug => catMap.get(slug))
    .filter(Boolean);

  const [postRes, peopleRes] = await Promise.all([
    fetch(WP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: POSTS_QUERY, variables: { search: q, categoryIn: catIds } }),
    }).then(r => r.json()),
    includePeople
      ? fetch(WP, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: PEOPLE_QUERY, variables: { search: q, categoryIn: catIds } }),
        }).then(r => r.json())
      : Promise.resolve({ data: { people: { nodes: [] } } }),
  ]);

  const results = [];

  for (let p of postRes.data?.posts?.nodes || []) {
    results.push({
      type: "post",
      title: p.title,
      url: `/posts/${p.slug}`,
      label: p.categories?.nodes[0]?.slug || "Post",
    });
  }

  for (let p of peopleRes.data?.people?.nodes || []) {
    results.push({
      type: "person",
      title: p.title,
      url: `/people/${p.slug}`,
      label: p.categories?.nodes[0]?.slug || "People",
    });
  }

  return NextResponse.json({
    ok: true,
    version: "posts+people",
    q,
    rawSlugs,
    includePeople,
    catIdsResolved: catIds,
    counts: {
      posts: postRes.data?.posts?.nodes?.length || 0,
      people: peopleRes.data?.people?.nodes?.length || 0,
      total: results.length,
    },
    results,
  });
}
