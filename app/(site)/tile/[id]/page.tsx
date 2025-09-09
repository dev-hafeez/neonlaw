import HeroTransition from "@/components/layout/HeroTransition";
import TileTabs from "@/components/layout/TileTabs";
import Footer from "@/components/layout/Footer";

// import Navbar from "@/components/nav/navbar";

export const revalidate = 60;

type WPJson = { data?: any; errors?: any };

// ---- Types for safety ----
type ImageNode = {
  node?: { sourceUrl: string; altText?: string | null; mediaDetails?: { width?: number; height?: number } };
};
type Term = { name: string; slug: string };
type Person = {
  slug: string;
  title: string;
  peopleFields?: { position?: string | null };
  featuredImage?: ImageNode;
};
type Deal = {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: ImageNode;
};

type PostFields = {
  client?: string | null;
  stage?: string | null;
  expertise?: { nodes?: Term[] } | null;
  teamMembers?: { nodes?: Person[] } | null;
  relatedDeals?: { nodes?: Deal[] } | null;
};

type Post = {
  title: string;
  content?: string | null;
  excerpt?: string | null;
  date?: string | null;
  slug: string;
  databaseId: number;
  featuredImage?: ImageNode;
  categories?: { nodes?: Term[] } | null;
  postFields?: PostFields | null;
};

// ---- Generic WP fetch ----
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

// ---- GraphQL selection set ----
const FIELDS = `
  title
  content
  excerpt
  date
  slug
  databaseId
  featuredImage { node { sourceUrl altText mediaDetails { width height } } }
  categories { nodes { name slug } }
  postFields {
    client
    stage
    expertise { nodes { name slug } }
    teamMembers {
      nodes {
        ... on Person {
          slug
          title
          peopleFields { position }
          featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        }
      }
    }
    relatedDeals {
      nodes {
        ... on Post {
          slug
          title
          excerpt
          featuredImage { node { sourceUrl altText mediaDetails { width height } } }
        }
      }
    }
  }
`;

// ---- Data loader ----
async function getPostBySlug(slug: string): Promise<Post | null> {
  const value = decodeURIComponent(slug).replace(/\/+$/, "").toLowerCase();
  const uri = `/${value}/`;

  // 1) post(id: SLUG)
  {
    const q = `query($slug: ID!){ post(id: $slug, idType: SLUG) { ${FIELDS} } }`;
    const j = await wp(q, { slug: value });
    if (j?.data?.post) return j.data.post as Post;
  }
  // 2) postBy(slug)
  {
    const q = `query($s: String!) { postBy(slug: $s) { ${FIELDS} } }`;
    const j = await wp(q, { s: value });
    if (j?.data?.postBy) return j.data.postBy as Post;
  }
  // 3) posts(where: {slugIn})
  {
    const q = `query($s: [String]) { posts(first:1, where: { slugIn: $s }) { nodes { ${FIELDS} } } }`;
    const j = await wp(q, { s: [value] });
    const node = j?.data?.posts?.nodes?.[0];
    if (node) return node as Post;
  }
  // 4) posts(where: {name})
  {
    const q = `query($n: String){ posts(first:1, where: { name: $n }) { nodes { ${FIELDS} } } }`;
    const j = await wp(q, { n: value });
    const node = j?.data?.posts?.nodes?.[0];
    if (node) return node as Post;
  }
  // 5) contentNodeBy(uri)
  {
    const q = `query($u: String!){
      contentNodeBy(uri: $u) {
        __typename
        ... on Post { ${FIELDS} }
      }
    }`;
    const j = await wp(q, { u: uri });
    const node = j?.data?.contentNodeBy;
    if (node) return node as Post;
  }

  return null;
}

// ---- Page ----
export default async function TilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostBySlug(id);

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 text-center bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Tile not found</h2>
          <p className="text-gray-500">The tile you clicked doesn’t exist or isn’t published.</p>
        </div>
      </div>
    );
  }

  const img = post?.featuredImage?.node;
  const pf = post.postFields ?? {};
  const expertiseTerms = pf.expertise?.nodes ?? [];
  const teamNodes = pf.teamMembers?.nodes ?? [];
  const deals = pf.relatedDeals?.nodes ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-white relative">
      {/* X Button */}
      <a
        href="/"
        aria-label="Go back to Home"
        className="absolute top-4 right-4 z-50 bg-blue-400 hover:bg-blue-600  rounded-xl w-12 flex flex-col items-center justify-center p-2 shadow transition"
        style={{ lineHeight: 0 }}
      >
        <span className="text-2xl font-bold text-gray-700">&times;</span>
      </a>

      {/* <Navbar /> */}

      {/* HERO */}
      <div className="relative w-full h-[70vh] md:h-[98vh] overflow-hidden">
        <HeroTransition />
        {img?.sourceUrl && (
          <img
            src={img.sourceUrl}
            alt={img.altText || post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {post.categories?.nodes?.[0]?.name && (
            <p className="text-sm md:text-base uppercase tracking-widest text-[#0a72bd] mb-1 font-semibold">
              {post.categories.nodes[0].name}
            </p>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white">
            {post.title}
          </h1>
        </div>
      </div>

      <main className="w-full max-w-6xl mx-auto flex-1 px-4 py-8 md:py-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-sm mb-6">
          <ul className="flex flex-wrap items-center gap-2 text-gray-500">
            <li><a href="/" className="hover:underline">Home</a></li>
            {post.categories?.nodes?.map((c) => (
              <li key={c.slug} className="flex items-center gap-2">
                <span>/</span>
                <a href={`/${c.slug}`} className="hover:underline">{c.name}</a>
              </li>
            ))}
            <li className="flex items-center gap-2">
              <span>/</span>
              <span className="font-semibold text-gray-700">{post.title}</span>
            </li>
          </ul>
        </nav>

        {/* Key Facts Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-[#0a72bd] pb-2">Key Facts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm md:text-base">
            <div>
              <h4 className="uppercase font-semibold text-[#0a72bd] mb-1">Client</h4>
              <p className="text-gray-700">{pf.client || '-'}</p>
            </div>
            <div>
              <h4 className="uppercase font-semibold text-[#0a72bd] mb-1">Expertise</h4>
              <p className="text-gray-700">
                {expertiseTerms.length ? expertiseTerms.map((t, i) => (
                  <span key={t.slug}>
                    {i > 0 && ', '}
                    <a href={`/${t.slug}`} className="text-[#0a72bd] hover:underline">
                      {t.name}
                    </a>
                  </span>
                )) : '-'}
              </p>
            </div>
            <div>
              <h4 className="uppercase font-semibold text-[#0a72bd] mb-1">Team</h4>
              {teamNodes.length ? (
                <ul className="space-y-1">
                  {teamNodes.map((m) => (
                    <li key={m.slug}>
                      <a href={`/people/${m.slug}`} className="text-[#0a72bd] hover:underline">
                        {m.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">-</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        {post.content && (
          <div className="mb-12">
            <div 
              className="prose prose-lg text-gray-800 leading-relaxed md:columns-2 md:gap-8"
              style={{
                '--tw-prose-headings': '#0a72bd',
                '--tw-prose-links': '#0a72bd',
                '--tw-prose-bold': '#0a72bd',
              } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}

        {/* Tabs with cards - moved to lower part */}
        <div className="mt-12">
          <TileTabs
            initial={teamNodes.length ? 'team' : (deals.length ? 'deals' : 'all')}
            content={post.content}
            teamMembers={teamNodes}
            deals={deals}
          />
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}