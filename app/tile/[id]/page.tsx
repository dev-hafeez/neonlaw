import HeroTransition from "@/components/HeroTransition";
import Footer from "@/components/footer";
import Link from "next/link";
import { X } from "lucide-react"; // nice icon from lucide-react


export const revalidate = 60;

type WPJson = { data?: any; errors?: any };

async function wp(query: string, variables?: Record<string, any>): Promise<WPJson> {
  const res = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(variables ? { query, variables } : { query }),
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

async function getPosts() {
  const q = `
    query {
      posts(first: 8, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          excerpt
          featuredImage { node { sourceUrl altText } }
          categories { nodes { name } }
        }
      }
    }
  `;
  const j = await wp(q);
  return j?.data?.posts?.nodes || [];
}

export default async function TilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostBySlug(id);
  const posts = await getPosts();

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
    <div className="min-h-screen bg-white relative">
      {/* Top-right close button */}
<Link
  href="/"
  className="absolute top-4 right-4 z-50 bg-transparent border-3 border-white hover:bg-[#0a72bd] hover:border-[#0a72bd] text-white p-2 transition rounded-10 font-bold"
  aria-label="Back to home"
>
  <X className="w-6 h-6" />
</Link>



      
      <Footer/>
      <div className="w-full h-[100vh] relative">
        <HeroTransition />
        {img?.sourceUrl && (
          <img
            src={img.sourceUrl}
            alt={img.altText || post.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto py-16 px-4">
        <div className="mb-4 text-sm text-gray-500 font-medium">
          {post.categories?.nodes?.length > 0 && (
            <>
              Home &gt; {post.categories.nodes.map((cat: any, i: number) => (
                <span key={cat.slug}>
                  {cat.name}
                  {i < post.categories.nodes.length - 1 && " > "}
                </span>
              ))}
            </>
          )}
        </div>
        <h1 className="text-5xl font-extrabold mb-8 text-gray-900">
          {post.title}
        </h1>
        <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-800">
          <div>
            {post.excerpt && (
              <div
                className="mb-6"
                dangerouslySetInnerHTML={{ __html: post.excerpt }}
              />
            )}
          </div>
          <div>
            {post.content && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            )}
          </div>
        </div>
      </div>

      {/* --- Grid Section Below --- */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">More from NEON</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {posts.map((p: any) => (
            <a
              key={p.id}
              href={`/tile/${p.slug}`}
              className="relative group rounded-lg overflow-hidden shadow hover:shadow-lg transition aspect-square flex"
              style={{ aspectRatio: "1 / 1" }}
            >
              {p.featuredImage?.node?.sourceUrl && (
                <img
                  src={p.featuredImage.node.sourceUrl}
                  alt={p.featuredImage.node.altText || p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                {p.categories?.nodes?.[0]?.name && (
                  <div className="text-sm text-white/80 mb-1">
                    {p.categories.nodes[0].name}
                  </div>
                )}
                <div className="text-lg font-semibold text-white leading-tight">
                  {p.title}
                </div>
              </div>
            </a>
          ))}
        </div>
        {/* Plus icon button below the grid */}
        <div className="flex justify-center mt-8">
          <button
            className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0a72bd] hover:bg-[#065f9e] text-white text-2xl shadow-lg transition"
            aria-label="Load more posts"
            // onClick={handleLoadMore} // Add your load more logic here
            disabled
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="14" fill="none"/>
              <path d="M14 7v14M7 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
      {/* --- End Grid Section --- */}
      
    </div>
  );
}
