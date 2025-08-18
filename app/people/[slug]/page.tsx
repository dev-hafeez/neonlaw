export const revalidate = 60;

const QUERY = `
  query Person($slug: ID!) {
    person(id:$slug, idType: SLUG) {
      title slug content excerpt
      featuredImage { node { sourceUrl altText } }
      peopleFields { position email linkedin office }
      categories { nodes { name slug } }
    }
  }
`;

async function wp(query: string, variables?: any) {
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 8000);
  
  try {
    const r = await fetch(process.env.WP_GRAPHQL_ENDPOINT!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: ctrl.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(timeout);
    return r.json();
  } catch (error) {
    clearTimeout(timeout);
    console.error('WP fetch error:', error);
    return { data: null, errors: [error] };
  }
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await wp(QUERY, { slug });
  const p = data?.person;
  if (!p) return <div className="p-8">Person not found.</div>;

  // Reuse your existing post-detail components/sections here.
  // For a quick render:
  return (
    <main>
      <section className="relative h-[50vh] bg-gray-100">
        {p.featuredImage?.node?.sourceUrl && (
          <img src={p.featuredImage.node.sourceUrl} alt={p.featuredImage.node.altText || p.title}
               className="w-full h-full object-cover" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60">
          <h1 className="text-4xl font-extrabold text-white">{p.title}</h1>
          {p.peopleFields?.position && <p className="text-white/90">{p.peopleFields.position}</p>}
        </div>
      </section>

      <div className="max-w-3xl mx-auto p-6">
        <div className="text-sm space-x-4 mb-6">
          {p.peopleFields?.email && <a className="underline" href={`mailto:${p.peopleFields.email}`}>Email</a>}
          {p.peopleFields?.linkedin && <a className="underline" href={p.peopleFields.linkedin} target="_blank">LinkedIn</a>}
          {p.peopleFields?.office && <span>Office: {p.peopleFields.office}</span>}
        </div>

        {p.excerpt && <div className="prose mb-6" dangerouslySetInnerHTML={{ __html: p.excerpt }} />}
        {p.content && <article className="prose" dangerouslySetInnerHTML={{ __html: p.content }} />}
      </div>
    </main>
  );
}
