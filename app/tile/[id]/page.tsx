import HeroTransition from "@/components/HeroTransition";
import Navbar from "@/components/nav/navbar";

export const revalidate = 60;

type WPJson = { data?: any; errors?: any };

async function wp(query: string, variables?: Record<string, any>): Promise<WPJson> {
  const res = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variables ? { query, variables } : { query }),
    // server component: this runs on the server; no CORS issues
    next: { revalidate: 60 },
  });
  try {
    return await res.json();
  } catch {
    return { errors: [{ message: "Invalid JSON from WP" }] };
  }
}

const FIELDS = `
  title
  content
  excerpt
  date
  slug
  databaseId
  featuredImage { node { sourceUrl altText mediaDetails { width height } } }
  categories { nodes { name slug } }
`;

async function getPostBySlug(slug: string) {
  const value = decodeURIComponent(slug).replace(/\/+$/, "").toLowerCase();
  const uri = `/${value}/`;

  // 1) post(id: SLUG) with variables
  {
    const q = `query($slug: ID!){ post(id: $slug, idType: SLUG) { ${FIELDS} } }`;
    const j = await wp(q, { slug: value });
    if (j?.data?.post) return j.data.post;
  }

  // 2) postBy(slug)
  {
    const q = `query($s: String!) { postBy(slug: $s) { ${FIELDS} } }`;
    const j = await wp(q, { s: value });
    if (j?.data?.postBy) return j.data.postBy;
  }

  // 3) posts(where: { slugIn: [...] })
  {
    const q = `query($s: [String]) { posts(first:1, where: { slugIn: $s }) { nodes { ${FIELDS} } } }`;
    const j = await wp(q, { s: [value] });
    const node = j?.data?.posts?.nodes?.[0];
    if (node) return node;
  }

  // 4) posts(where: { name: value })
  {
    const q = `query($n: String){ posts(first:1, where: { name: $n }) { nodes { ${FIELDS} } } }`;
    const j = await wp(q, { n: value });
    const node = j?.data?.posts?.nodes?.[0];
    if (node) return node;
  }

  // 5) contentNodeBy(uri: "/slug/")
  {
    const q = `query($u: String!){
      contentNodeBy(uri: $u) {
        __typename
        ... on Post { ${FIELDS} }
      }
    }`;
    const j = await wp(q, { u: uri });
    const node = j?.data?.contentNodeBy;
    if (node) return node;
  }

  return null;
}

export default async function TilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 15: params are async
  const { id } = await params;

  const post = await getPostBySlug(id);

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 text-center bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tile not found</h2>
          <p className="text-gray-500">
            The tile you clicked doesn’t exist or isn’t published.
          </p>
        </div>
      </div>
    );
  }

  const img = post?.featuredImage?.node;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar/>
      <div className="w-full h-[100vh] relative">
        <HeroTransition />

        {img?.sourceUrl && (
          <img
            src={img.sourceUrl}
            alt={img.altText || post.title}
            className="w-full h-full"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4">
        {post.excerpt && (
          <p
            className="text-lg text-gray-700 mb-6"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        )}
        {post.content && (
          <article
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </div>
    </div>
  );
}
