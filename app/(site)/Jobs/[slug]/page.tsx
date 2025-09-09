import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JobCarousel from "@/components/jobs/JobCarousel";
import { wpFetch } from "@/lib/api/fetcher";

export const revalidate = 60;

const JOB_QUERY = /* GraphQL */ `
  query JobBySlug($slug: ID!) {
    job(id: $slug, idType: SLUG) {
      title
      slug
      featuredImage { node { sourceUrl altText } }
      jobFields {
        tileLabel
        tileTitle
        introduction
        heroTitle
        ctaLabel
        ctaUrl
        mission
        offer
        profile
        signingBonus
        contactPerson {
          nodes {
            ... on Person {
              title
              slug
              peopleFields {
                position
                email
                linkedin
                headshot { node { sourceUrl altText } }
              }
            }
          }
        }
        contact { name email phone }
      }
    }
  }
`;

const MORE_JOBS_QUERY = /* GraphQL */ `
  query MoreJobs {
    jobs(first: 6, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes {
        slug
        title
        featuredImage { node { sourceUrl altText } }
        jobFields { tileTitle tileLabel }
      }
    }
  }
`;

function stripHtml(s?: string | null) {
  return (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

// turn textarea content into bullet <li> items (split by newlines)
function bullets(s?: string | null) {
  return (s || "")
    .split(/\r?\n/)
    .map(t => t.trim())
    .filter(Boolean);
}

// Removed wp function - using wpFetch from fetcher.ts instead

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await wpFetch(JOB_QUERY, { slug });
  const j = data?.job;
  if (!j) return { title: "Job not found" };

  const title = j.jobFields?.heroTitle || j.title;
  const desc = stripHtml(j.jobFields?.introduction) || undefined;
  const img = j.featuredImage?.node?.sourceUrl as string | undefined;

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: img ? [{ url: img }] : undefined },
    twitter: { card: "summary_large_image", title, description: desc, images: img ? [img] : undefined },
  };
}

export default async function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await wpFetch(JOB_QUERY, { slug });
  const job = data?.job;
  if (!job) return notFound();

  const f = job.jobFields || {};
  const heroTitle = f.heroTitle || job.title;
  const ctaLabel = f.ctaLabel || "Apply now";

  // contact via Person (preferred) or manual fallback
  const person = f.contactPerson?.nodes?.[0] || null;
  const fallback = f.contact || null;

  // fetch some "More Jobs" (client will filter out current slug)
  const { data: mj } = await wpFetch(MORE_JOBS_QUERY);
  const moreJobs: Array<any> = (mj?.jobs?.nodes || []).filter((n: any) => n.slug !== slug).slice(0, 5);

  return (
    <main className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative h-screen bg-gradient-to-br from-orange-200 via-pink-200 to-orange-300 overflow-hidden">
        {job.featuredImage?.node?.sourceUrl && (
          <div className="absolute inset-0">
            <img
              src={job.featuredImage.node.sourceUrl}
              alt={job.featuredImage.node.altText || heroTitle}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>
        )}
        
        <div className="relative h-full flex items-center">
          <div className="mx-auto max-w-7xl px-6 w-full">
            <div className="text-center">
              {f.tileLabel && (
                <p className="text-white/90 text-lg md:text-xl mb-4 font-medium tracking-wide">
                  {f.tileLabel}
                </p>
              )}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                {heroTitle}
              </h1>
              {f.ctaUrl && (
                <a
                  href={f.ctaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-pink-600 text-white text-lg font-semibold rounded-xl hover:bg-pink-700 transition-colors shadow-lg"
                >
                  {ctaLabel}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BREADCRUMB */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">&gt;</span>
            <span>Jobs</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium">{f.tileTitle || job.title}</span>
          </nav>
        </div>
      </section>

      {/* INTRO */}
      {f.introduction && (
        <section className="py-12 bg-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                {f.introduction}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* MAIN CONTENT */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-12">
              {/* Mission */}
              {(f.mission || "").trim() && (
                <div>
                  <h2 className="text-2xl font-bold text-pink-600 mb-6">Your mission</h2>
                  <div className="space-y-3">
                    {bullets(f.mission).map((item, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-pink-600 mr-3 mt-1 flex-shrink-0">-</span>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile */}
              {(f.profile || "").trim() && (
                <div>
                  <h2 className="text-2xl font-bold text-pink-600 mb-6">Your profile</h2>
                  <div className="space-y-3">
                    {bullets(f.profile).map((item, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-pink-600 mr-3 mt-1 flex-shrink-0">+</span>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* Offer */}
              {(f.offer || "").trim() && (
                <div>
                  <h2 className="text-2xl font-bold text-pink-600 mb-6">What we offer</h2>
                  <div className="space-y-3">
                    {bullets(f.offer).map((item, i) => (
                      <div key={i} className="flex items-start">
                        <span className="text-pink-600 mr-3 mt-1 flex-shrink-0">+</span>
                        <span className="text-gray-700 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signing bonus */}
              {(f.signingBonus || "").trim() && (
                <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                  <h2 className="text-xl font-bold text-pink-600 mb-4">Signing Bonus</h2>
                  <p className="text-gray-700 leading-relaxed">{f.signingBonus}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      {(person || fallback) && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-6xl px-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                {/* Left: Image */}
                <div className="relative h-64 md:h-auto">
                  {person?.peopleFields?.headshot?.node?.sourceUrl ? (
                    <img
                      src={person.peopleFields.headshot.node.sourceUrl}
                      alt={person.peopleFields.headshot.node.altText || person.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-orange-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-pink-600 text-2xl font-bold">
                            {(person?.title || fallback?.name || 'C').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <p className="text-gray-600">Contact Person</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Contact Info */}
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl font-bold text-pink-600 mb-6">Any questions?</h3>

                  {person ? (
                    <>
                      <p className="text-gray-700 mb-6 leading-relaxed">
                        Feel free to contact our <strong>Head of People & Culture Business Services</strong> at{' '}
                        <a href={`mailto:${person.peopleFields?.email}`} className="text-blue-600 hover:underline">
                          jobs@neon.law
                        </a>{' '}
                        or give her a call.
                      </p>
                      
                      <p className="text-gray-700 mb-6">
                        Click <strong>"{ctaLabel}"</strong> to send us your application in German including your{' '}
                        <strong>CV, motivational letter with salary expectations</strong> and{' '}
                        <strong>entry date</strong> as well as your relevant <strong>job references</strong>.
                      </p>

                      <p className="text-gray-700 mb-8">We look forward to meeting you!</p>

                      <div className="space-y-4">
                        <p className="font-semibold text-gray-900 text-lg">
                          {person.title}
                        </p>
                        
                        <div className="flex gap-3">
                          {person.peopleFields?.email && (
                            <a 
                              href={`mailto:${person.peopleFields.email}`}
                              className="inline-flex items-center gap-2 bg-pink-500 text-white border border-pink-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-pink-600 transition-colors"
                            >
                              ✉️ Email
                            </a>
                          )}
                          {fallback?.phone && (
                            <a 
                              href={`tel:${fallback.phone}`}
                              className="inline-flex items-center gap-2 bg-pink-500 text-white border border-pink-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-pink-600 transition-colors"
                            >
                              📞 Call
                            </a>
                          )}
                          {person.peopleFields?.linkedin && (
                            <a 
                              href={person.peopleFields.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 bg-pink-500 text-white border border-pink-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-pink-600 transition-colors"
                            >
                              🔗 LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-700 mb-6">
                        Feel free to contact <strong>{fallback?.name}</strong>.
                      </p>
                      <div className="flex gap-3">
                        {fallback?.email && (
                          <a 
                            href={`mailto:${fallback.email}`}
                            className="inline-flex items-center gap-2 bg-pink-500 text-white border border-pink-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-pink-600 transition-colors"
                          >
                            ✉️ Email
                          </a>
                        )}
                        {fallback?.phone && (
                          <a 
                            href={`tel:${fallback.phone}`}
                            className="inline-flex items-center gap-2 bg-pink-500 text-white border border-pink-500 rounded-full px-4 py-2 text-sm font-medium hover:bg-pink-600 transition-colors"
                          >
                            📞 Call
                          </a>
                        )}
                      </div>
                    </>
                  )}

                  {f.ctaUrl && (
                    <div className="mt-8">
                      <a
                        href={f.ctaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-8 py-4 bg-pink-600 text-white text-lg font-semibold rounded-xl hover:bg-pink-700 transition-colors shadow-lg"
                      >
                        {ctaLabel}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL VACANCIES CAROUSEL */}
      <JobCarousel jobs={moreJobs} />
    </main>
  );
}
