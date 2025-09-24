"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import JobCarousel from "@/components/jobs/JobCarousel";
import Footer from '@/components/layout/Footer';


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

// Metadata will be handled by the parent layout or through dynamic imports

export default function JobPage({ params }: { params: Promise<{ slug: string }> }) {
  const [job, setJob] = useState<any>(null);
  const [moreJobs, setMoreJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
        
        // Use Next.js API routes instead of direct WordPress calls
        const [jobResponse, moreJobsResponse] = await Promise.all([
          fetch(`/api/jobs/${resolvedParams.slug}`),
          fetch('/api/jobs?limit=6')
        ]);
        
        if (!jobResponse.ok) {
          throw new Error('Job not found');
        }
        
        const jobResult = await jobResponse.json();
        const moreJobsData = await moreJobsResponse.json();
        
        if (!jobResult) {
          notFound();
          return;
        }
        
        setJob(jobResult);
        const filteredJobs = (moreJobsData?.nodes || [])
          .filter((n: any) => n.slug !== resolvedParams.slug)
          .slice(0, 5);
        setMoreJobs(filteredJobs);
      } catch (error) {
        console.error('Error fetching job data:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show footer when user is near the bottom (within 100px of the end)
      const threshold = 100;
      const isNearBottom = scrollTop + windowHeight >= documentHeight - threshold;
      
      setShowFooter(isNearBottom);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </main>
    );
  }

  if (!job) {
    return notFound();
  }

  const f = job.jobFields || {};
  const heroTitle = f.heroTitle || job.title;
  const ctaLabel = f.ctaLabel || "Apply now";

  // contact via Person (preferred) or manual fallback
  const person = f.contactPerson?.nodes?.[0] || null;
  const fallback = f.contact || null;

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* STICKY APPLY NOW BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href={`/ApplyNow`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center px-16 mb-20 mr-8 py-6 bg-blue-400 text-white text-3xl font-bold rounded-md hover:bg-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 min-w-[200px]"
        >
          {ctaLabel || "Apply now"}
          <svg 
            className="ml-2 w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </a>
      </div>

      {/* HERO SECTION */}
      <section className="relative h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-6 right-6 z-50 bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-xl transition-all duration-300"
          aria-label="Close"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        
        {/* Background Image */}
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
        
        {/* Hero Content */}
        <div className="relative h-full flex items-end mr-76">
          <div className="mx-auto max-w-7xl px-6 w-full pb-20">
            {/* Job Title */}
            <div className="text-start ">
              {f.tileLabel && (
                <p className="text-white text-2xl lg:text-5xl  font-medium tracking-wide ">
                  {heroTitle}
                </p>
              )}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3">
                {f.tileLabel}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* BREADCRUMBS - Below Hero Image */}
      <section className="py-6 bg-white">
        <div className="mx-auto max-w-7xl ml-18">
          <nav className="text-sm text-gray-600">
            <span>Home</span>
            <span className="mx-2">&gt;</span>
            <span>Jobs</span>
            <span className="mx-2">&gt;</span>
            <span className="font-medium">{f.tileTitle || job.title}</span>
          </nav>
        </div>
      </section>


      {/* INTRODUCTION SECTION */}
      {f.introduction && (
        <section className="py-16">
          <div className=" ml-18">
            <div className="text-left">
              <p className="text-xl mb-8 text-gray-700 leading-relaxed text-justify max-w-8xl mr-8">
                {f.introduction}
              </p>
              <br />
                <h1 className="flex gap-3">
                <h1 className="text-5xl md:text-5xl font-bold text-blue-400">
                {f.tileTitle || job.title}
              </h1>
              <h1 className="text-5xl md:text-5xl font-bold text-blue-400">
                {job.title}
              </h1>
              </h1>
            </div>
          </div>
        </section>
      )}

      {/* JOB DETAILS SECTION - Vertical Layout */}
      <section>
        <div className="mx-auto max-w-7xl ml-18">
          <div className="space-y-16">
            {/* Mission */}
            {f.mission && (
              <div>
                <div className="w-full h-px bg-blue-400 mb-4"></div>
                <div className="grid grid-cols-10 gap-8">
                  {/* 30% - Heading Area */}
                  <div className="col-span-3">
                    <h2 className="text-3xl font-bold text-blue-400">Your mission</h2>
                  </div>
                  
                  {/* 70% - Text Content Area */}
                  <div className="col-span-7">
                    <div className="space-y-4">
                      {f.mission.split('\n').filter(Boolean).map((item: string, i: number) => (
                        <div key={i} className="flex items-start">
                          <span className="text-blue-400 mr-4 mt-1 flex-shrink-0 text-xl">+</span>
                          <span className="text-gray-700 leading-relaxed text-lg text-justify">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile */}
            {f.profile && (
              <div>
                <div className="w-full h-px bg-blue-400 mb-4"></div>
                <div className="grid grid-cols-10 gap-8">
                  {/* 30% - Heading Area */}
                  <div className="col-span-3">
                    <h2 className="text-3xl font-bold text-blue-400">Your profile</h2>
                  </div>
                  
                  {/* 70% - Text Content Area */}
                  <div className="col-span-7">
                    <div className="space-y-4">
                      {f.profile.split('\n').filter(Boolean).map((item: string, i: number) => (
                        <div key={i} className="flex items-start">
                          <span className="text-blue-400 mr-4 mt-1 flex-shrink-0 text-xl">+</span>
                          <span className="text-gray-700 leading-relaxed text-lg text-justify">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Offer */}
            {f.offer && (
              <div>
                <div className="w-full h-px bg-blue-400 mb-4 "></div>
                <div className="grid grid-cols-10 gap-8">
                  {/* 30% - Heading Area */}
                  <div className="col-span-3">
                    <h2 className="text-3xl font-bold text-blue-400">What we offer</h2>
                  </div>
                  
                  {/* 70% - Text Content Area */}
                  <div className="col-span-7">
                    <div className="space-y-4">
                      {f.offer.split('\n').filter(Boolean).map((item : string, i: number) => (
                        <div key={i} className="flex items-start">
                          <span className="text-blue-400 mr-4 mt-1 flex-shrink-0 text-xl">+</span>
                          <span className="text-gray-700 leading-relaxed text-lg text-justify">{item.trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Signing bonus */}
            {f.signingBonus && (
              <div className="bg-blue-50 rounded-xl p-8 border border-blue-200 ml-18">
                <div className="w-full h-px bg-blue-400 mb-4"></div>
                <div className="grid grid-cols-10 gap-8">
                  {/* 30% - Heading Area */}
                  <div className="col-span-3">
                    <h2 className="text-2xl font-bold text-blue-400">Signing Bonus</h2>
                  </div>
                  
                  {/* 70% - Text Content Area */}
                  <div className="col-span-7">
                    <p className="text-gray-700 leading-relaxed text-lg text-justify">{f.signingBonus}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* JOB METADATA SECTION */}
     
              


      {/* CONTACT SECTION - Refactored */}
      <section className="py-16 bg-white">
        <div className="mx-auto mr-28 px-6 ml-18">
          <div className="flex items-center gap-0 bg-white border border-gray-300 shadow-lg overflow-hidden">
            {/* Left: Person Image */}
            <div className="relative flex-shrink-0 w-180 h-110">
              {person?.peopleFields?.headshot?.node?.sourceUrl ? (
                <img
                  src={person.peopleFields.headshot.node.sourceUrl}
                  alt={person.peopleFields.headshot.node.altText || person.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-blue-600 text-2xl font-bold">
                        {(person?.title || fallback?.name || 'C').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <p className="text-gray-600">Contact Person</p>
                  </div>
                </div>
              )}
              
              {/* White Arrow Separator */}
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                <div className="w-0 h-0 border-l-[30px] border-l-white border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent"></div>
              </div>
            </div>

            {/* Right: Contact Info */}
            <div className="flex-1 bg-white p-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-6">Any questions?</h3>

              {person ? (
                <>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Feel free to contact our <strong>{person.peopleFields?.position || 'Head of People & Culture | Business Professionals'}</strong> at{' '}
                    <a href={`mailto:${person.peopleFields?.email || 'jobs@neon.law'}`} className="text-blue-600 hover:underline font-semibold">
                      {person.peopleFields?.email || 'jobs@neon.law'}
                    </a>{' '}
                    or give her a call.
                  </p>
                  
                  <p className="text-gray-700 mb-4">
                    Click <strong>"Apply now"</strong> to send us your application in German including your{' '}
                    <strong>CV</strong>, motivational letter, relevant transcripts and references.
                  </p>

                  <p className="text-gray-700 mb-4">
                    We're always excited to connect with talented professionals who share our passion for excellence and innovation. 
                    Don't hesitate to reach out if you have any questions about this position or our company culture.
                  </p>

                  <p className="text-gray-700 mb-6">We look forward to meeting you!</p>

                  <div className="space-y-4">
                    <p className="font-bold text-blue-600 text-xl">
                      {person.title || 'Olga Caudill'}
                    </p>
                    
                    <p className="text-gray-600 text-sm">
                      {person.peopleFields?.position || 'Head of People & Culture | Business Professionals'}
                    </p>
                    
                    <div className="flex gap-3">
                      <a 
                        href={`mailto:${person.peopleFields?.email || 'jobs@neon.law'}`}
                        className="inline-flex items-center justify-center w-12 h-12 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        aria-label="Email"
                        title="Send an email"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </a>
                      <a 
                        href={`tel:${fallback?.phone || '+49 30 12345678'}`}
                        className="inline-flex items-center justify-center w-12 h-12 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        aria-label="Phone"
                        title="Call us"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                      </a>
                      <a 
                        href={person.peopleFields?.linkedin || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                        aria-label="LinkedIn"
                        title="Connect on LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-600 text-sm">
                        <strong>Quick Response:</strong> We typically respond to applications within 2-3 business days. 
                        For urgent inquiries, feel free to call us directly.
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    Feel free to contact <strong>{fallback?.name || 'Our Team'}</strong> for any questions about this position.
                  </p>
                  
                  <p className="text-gray-700 mb-4">
                    We're always excited to connect with talented professionals who share our passion for excellence and innovation. 
                    Don't hesitate to reach out if you have any questions about this position or our company culture.
                  </p>

                  <p className="text-gray-700 mb-6">We look forward to meeting you!</p>

                  <div className="space-y-4">
                    <p className="font-bold text-blue-600 text-xl">
                      {fallback?.name || 'Our Team'}
                    </p>
                    
                    <div className="flex gap-3">
                      {fallback?.email && (
                        <a 
                          href={`mailto:${fallback.email}`}
                          className="inline-flex items-center justify-center w-12 h-12 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                          aria-label="Email"
                          title="Send an email"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </a>
                      )}
                      {fallback?.phone && (
                        <a 
                          href={`tel:${fallback.phone}`}
                            className="inline-flex items-center justify-center w-12 h-12 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                          aria-label="Phone"
                          title="Call us"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                        </a>
                      )}
                      <a 
                        href="https://linkedin.com/company/neon-law"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-600 hover:text-white transition-colors"
                        aria-label="LinkedIn"
                        title="Connect on LinkedIn"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                    
                    <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <p className="text-gray-600 text-sm">
                        <strong>Quick Response:</strong> We typically respond to applications within 2-3 business days. 
                        For urgent inquiries, feel free to call us directly.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ALL VACANCIES SECTION */}
      <section className="">
        <div>
          {/* Job Carousel */}
          <JobCarousel jobs={moreJobs || []} />
        </div>
      </section>
      
        {/* Footer - Only visible when reaching the end */}
        {showFooter && <Footer />}
    </main>
  );
}
