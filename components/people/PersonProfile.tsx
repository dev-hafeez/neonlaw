"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR from "swr";

type Person = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  featuredImage?: { node?: { sourceUrl?: string; altText?: string } | null } | null;
  categories?: { nodes?: { name: string; slug: string }[] } | null;
  peopleFields?: {
    position?: string | null;
    email?: string | null;
    linkedin?: string | null;
    office?: string | null;
    headline?: string | null;
    spotify?: string | null;
    introLeft?: string | null;
    introRight?: string | null;
    headshot?: { node?: { sourceUrl?: string; altText?: string } | null } | null;
    assistant?: { name?: string | null; email?: string | null; phone?: string | null } | null;
    qualifications?: string | null; // textarea (lines)
    work?: string | null;           // textarea (lines)
    education?: string | null;      // textarea (lines)
  } | null;
};

function pickImage(p: Person) {
  return p.peopleFields?.headshot?.node || p.featuredImage?.node || null;
}

function linesToList(s?: string | null): string[] {
  return (s || "")
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);
}

type TabKey = 'all' | 'deals' | 'team' | 'jobs';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PersonProfile({ person }: { person: Person }) {
  const img = pickImage(person);
  const pf = person.peopleFields || {};
  const categories = person.categories?.nodes || [];
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const qualifications = linesToList(pf.qualifications);
  const work = linesToList(pf.work);
  const education = linesToList(pf.education);
  const [limit1, setLimit1] = useState(3);
  const [limit2, setLimit2] = useState(4);
  const [limit3, setLimit3] = useState(4);
  const [limit4, setLimit4] = useState(6);

  // Fetch real data for tabs
  const { data: jobsData } = useSWR(`/api/jobs?limit=${limit1}`, fetcher);
  const { data: dealsData } = useSWR(`/api/posts?limit=${limit2}&cat=Deals`, fetcher);
  const { data: teamData } = useSWR(`/api/people?limit=${limit3}`, fetcher);
  const { data: allData } = useSWR(`/api/posts?limit=${limit4}`, fetcher);

  const jobs = jobsData?.nodes || [];
  const deals = dealsData?.nodes || [];
  const team = teamData?.nodes || [];
  const allContent = allData?.nodes || [];

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-screen bg-gray-900 overflow-hidden">
  {img?.sourceUrl ? (
    <Image
      src={img.sourceUrl}
      alt={img.altText || person.title}
      fill
      className="object-cover object-center"
      sizes="100vw"
      priority
    />
  ) : (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
  )}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

  {/* Top-right buttons */}
  <div className="absolute top-6 left-6 z-20 flex flex-wrap items-center gap-3">
    <div className="flex items-center gap-3">
  {pf.email && (
    <a 
      href={`mailto:${pf.email}`}
      className="flex items-center justify-center w-12 h-12 bg-white text-[#0a72bd] border border-[#0a72bd] rounded-xl hover:bg-[#085a96] transition-colors hover:text-white"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 
                 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 
                 4-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    </a>
  )}

  {/*pf.phone && (
    <a 
      href={`tel:${pf.phone}`}
      className="flex items-center justify-center w-12 h-12 bg-[#0a72bd] text-white border border-[#0a72bd] rounded-xl hover:bg-[#085a96] transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.6 10.8a15.05 15.05 0 006.6 6.6l2.2-2.2c.3-.3.8-.4 
                 1.2-.3 1.3.4 2.7.7 4.1.7.7 0 1.3.6 1.3 
                 1.3V20c0 .7-.6 1.3-1.3 1.3C10.3 
                 21.3 2.7 13.7 2.7 4.3 2.7 3.6 3.3 
                 3 4 3h3.2c.7 0 1.3.6 1.3 
                 1.3 0 1.4.2 2.8.7 4.1.1.4 0 
                 .9-.3 1.2l-2.3 2.2z"/>
      </svg>
    </a>
  )*/}

  {pf.linkedin && (
    <a 
      href={pf.linkedin} 
      target="_blank" 
      rel="noreferrer"
      className="flex items-center justify-center w-12 h-12 bg-white text-[#0a72bd] border border-[#0a72bd] rounded-xl hover:bg-[#085a96] transition-colors hover:text-white"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 
                 5v14c0 2.761 2.239 5 5 
                 5h14c2.761 0 5-2.239 
                 5-5v-14c0-2.761-2.239-5-5-5zm-11 
                 19h-3v-10h3v10zm-1.5-11.268c-.966 
                 0-1.75-.784-1.75-1.75s.784-1.75 
                 1.75-1.75 1.75.784 
                 1.75 1.75-.784 1.75-1.75 
                 1.75zm13.5 11.268h-3v-5.604c0-1.337-.027-3.059-1.865-3.059-1.867 
                 0-2.154 1.459-2.154 2.963v5.7h-3v-10h2.881v1.367h.041c.402-.761 
                 1.381-1.562 2.843-1.562 3.041 
                 0 3.604 2.002 3.604 4.604v5.591z"/>
      </svg>
    </a>
  )}

 {pf.spotify && (
  <a 
    href={pf.spotify} 
    target="_blank" 
    rel="noreferrer"
    className="flex items-center justify-center w-50 h-12 bg-white text-black  rounded-xl hover:text-white hover:bg-black transition-colors"
  ><div className="mr-5 font-bold">What i listen to</div>
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-500 left-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.372 0 0 5.373 0 12c0 
               6.627 5.372 12 12 12s12-5.373 
               12-12c0-6.627-5.372-12-12-12zm5.485 
               17.451a.747.747 0 01-1.03.272c-2.83-1.732-6.395-2.125-10.598-1.166a.75.75 
               0 01-.33-1.463c4.574-1.032 
               8.57-.57 11.757 1.354.36.22.475.692.201 
               1.003zm1.471-3.294a.934.934 0 
               01-1.282.34c-3.233-1.986-8.158-2.564-11.956-1.404a.937.937 
               0 01-1.155-.62.936.936 0 
               01.62-1.155c4.396-1.34 
               9.865-.696 13.617 1.597a.936.936 
               0 01.156 1.242zm.123-3.42c-3.857-2.294-10.23-2.505-13.896-1.373a1.124 
               1.124 0 01-.662-2.146c4.255-1.314 
               11.362-1.07 15.74 1.572a1.125 1.125 
               0 01-1.182 1.947z"/>
    </svg>
  </a>
)}

</div>

   {/* {pf.office && (
     <span className="inline-flex items-center gap-2 bg-[#0a72bd] 50 border border-[#0a72bd] 200 rounded-full px-4 py-2 text-sm font-medium text-[#0a72bd] 800">
        📍 {pf.office}
      </span>
    )}*/}
  </div>

  {/* Bottom content */}
  <div className="absolute bottom-0 left-0 p-6 md:p-12">
    <div className="max-w-6xl mx-auto">
      {pf.position && (
        <p className="text-white/90 text-lg md:text-2xl uppercase tracking-wider font-semibold mb-4">
  {pf.position}
</p>

      )}
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
        {person.title}
      </h1>
    </div>
  </div>
</section>


      {/* HEADLINE QUOTE */}
      {pf.headline && (
        <section className="py-12 md:py-20 bg-white">
  <div className="px-6">
    <h2 className="w-full text-2xl md:text-4xl lg:text-5xl font-bold italic text-gray-900 leading-relaxed text-left">
      "{pf.headline}"
    </h2>
  </div>
</section>

      )}

      <section className="py-12 md:py-16 bg-white text-left">
        <div className="max-w-6xl mx-auto px-6">
          {/* Contact chips */}
          

          {/* Main Content - Two Column Layout */}
          {(pf.introLeft || pf.introRight || person.content) && (
            <div className="grid gap-12 md:grid-cols-2 mb-12">
              <div className="space-y-6">
                {pf.introLeft && (
                  <div className="text-lg leading-relaxed text-gray-700">
                    {pf.introLeft}
                  </div>
                )}
                {person.content && !pf.introLeft && (
                  <article 
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed" 
                    dangerouslySetInnerHTML={{ __html: person.content }} 
                  />
                )}
              </div>
              <div className="space-y-6">
                {pf.introRight && (
                  <div className="text-lg leading-relaxed text-gray-700">
                    {pf.introRight}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Excerpt as fallback */}
          {!pf.introLeft && !pf.introRight && !person.content && person.excerpt && (
            <div 
              className="prose prose-lg max-w-none mb-12 text-gray-700 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: person.excerpt }} 
            />
          )}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#0a72bd] mb-8">
              About {person.title}
            </h3>
            <div className="w-full h-px bg-[#0a72bd] mb-8" />
          </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* a */}
  <div>
    <h4 className="text-lg font-semibold text-[#0a72bd] mb-4">Qualification</h4>
    <ul className="space-y-2">
      {qualifications.map((item, i) => (
        <li key={i} className="text-gray-700 leading-relaxed">{item}</li>
      ))}
    </ul>
  </div>

  {/* b */}
  <div>
    <h4 className="text-lg font-semibold text-[#0a72bd] mb-4">Work</h4>
    <ul className="space-y-2">
      {work.map((item, i) => (
        <li key={i} className="text-gray-700 leading-relaxed flex items-start">
          <span className="text-[#0a72bd] mr-2 mt-1">+</span>
          {item}
        </li>
      ))}
    </ul>
  </div>

  {/* c */}
  <div>
    <h4 className="text-lg font-semibold text-[#0a72bd] mb-4">Education</h4>
    <ul className="space-y-2">
      {education.map((item, i) => (
        <li key={i} className="text-gray-700 leading-relaxed flex items-start">
          <span className="text-[#0a72bd] mr-2 mt-1">+</span>
          {item}
        </li>
      ))}
    </ul>
  </div>

  {/* d */}
  {Array.isArray(categories) && categories.length > 0 && (
    <div>
      <h4 className="text-lg font-semibold text-[#0a72bd] mb-4">Excellences</h4>
      <ul className="space-y-2">
        {categories.map((c) => (
          <li key={c.slug}>
            <Link 
              className="text-sm text-[#0a72bd] hover:text-[#0a72bd] font-medium transition-colors underline" 
              href={`/people?cat=${encodeURIComponent(c.slug)}`}
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )}

  {/* e */}
  {(pf.assistant?.name || pf.assistant?.email || pf.assistant?.phone) && (
    <div>
      <h4 className="text-lg font-semibold text-[#0a72bd] mb-4">Assistants</h4>
      {pf.assistant?.name && (
        <p className="text-gray-900 font-medium mb-4">{pf.assistant.name}</p>
      )}
      <div className="space-y-3 flex gap-2">
        {pf.assistant?.email && (
  <a 
    className="flex items-center justify-center w-12 h-12 bg-white text-[#0a72bd] border border-[#0a72bd] rounded-xl hover:bg-[#085a96] transition-colors hover:text-white"
    href={`mailto:${pf.assistant.email}`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 
               2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 
               4-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  </a>
)}

{pf.assistant?.phone && (
  <a 
    className="flex items-center justify-center w-12 h-12 bg-white text-[#0a72bd] border border-[#0a72bd] rounded-xl hover:bg-[#085a96] transition-colors hover:text-white ml-2"
    href={`tel:${pf.assistant.phone}`}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 
               1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 
               1 1v3.5c0 .55-.45 1-1 1C10.85 21 3 13.15 3 
               4.5 3 3.95 3.45 3.5 4 3.5H7.5c.55 0 1 .45 
               1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 
               1.02l-2.2 2.2z"/>
    </svg>
  </a>
)}

      </div>
    </div>
  )}
</div>
</div>
      </section>

      {/* TABS SECTION */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tab Navigation */}
          <div className="flex justify-center gap-8 mb-12">
            {(['all', 'deals', 'team', 'jobs'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab
                    ? 'uppercase text-sm font-semibold tracking-wider text-[#0a72bd] 600 border-b-2 border-[#0a72bd] 600 pb-2 transition-colors'
                    : 'uppercase text-sm font-semibold tracking-wider text-gray-500 hover:text-[#0a72bd] 600 pb-2 transition-colors'
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'all' && (
              <div className="space-y-12">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">All Content</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allContent.map((item: any) => (
                      <a
                        key={item.id}
                        href={`/tile/${item.slug}`}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                      >
                        <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {item.featuredImage?.node?.sourceUrl ? (
                            <img
                              src={item.featuredImage.node.sourceUrl}
                              alt={item.featuredImage.node.altText || item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                              <span className="text-gray-400 text-sm">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h4>
                          {item.excerpt && (
                            <div 
                              className="text-sm text-gray-600 line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: item.excerpt }}
                            />
                          )}
                          {item.categories?.nodes?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {item.categories.nodes.slice(0, 2).map((cat: any) => (
                                <span
                                  key={cat.slug}
                                  className="inline-block px-2 py-1 bg-blue-100 100 text-[#0a72bd] 800 text-xs rounded-full"
                                >
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
    {team.length > 0 && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setLimit4((prev) => prev + 6)}
          className="px-6 py-2 border-black  text-blue-400 text-4xl transition hover:text-blue-500"
        >
          +
        </button>
      </div>
    )}
              </div>
            )}

            {activeTab === 'deals' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Deals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {deals.map((deal: any) => (
                    <a
                      key={deal.id}
                      href={`/tile/${deal.slug}`}
                      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow group"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#0a72bd] 100 to-[#0a72bd] 200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {deal.featuredImage?.node?.sourceUrl ? (
                            <img
                              src={deal.featuredImage.node.sourceUrl}
                              alt={deal.featuredImage.node.altText || deal.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[#0a72bd] 600 text-xs font-medium">Deal</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[#0a72bd] 600 transition-colors">{deal.title}</h4>
                          {deal.excerpt && (
                            <div 
                              className="text-sm text-gray-600 mb-2 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: deal.excerpt }}
                            />
                          )}
                          {deal.categories?.nodes?.length > 0 && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {deal.categories.nodes[0].name}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                {deals.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No deals available at the moment.</p>
                  </div>
                )}
    {team.length > 0 && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setLimit2((prev) => prev + 4)}
          className="px-6 py-2 border-black  text-blue-400 text-4xl transition hover:text-blue-500"
        >
          +
        </button>
      </div>
    )}
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {team.map((member: any) => (
                    <a
                      key={member.id}
                      href={`/people/${member.slug}`}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 overflow-hidden relative">
                        {member.peopleFields?.headshot?.node?.sourceUrl || member.featuredImage?.node?.sourceUrl ? (
                          <img
                            src={member.peopleFields?.headshot?.node?.sourceUrl || member.featuredImage?.node?.sourceUrl}
                            alt={member.peopleFields?.headshot?.node?.altText || member.featuredImage?.node?.altText || member.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold text-lg">
                                {member.title.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[#0a72bd] 600 transition-colors">{member.title}</h4>
                        {member.peopleFields?.position && (
                          <p className="text-sm text-gray-500 mb-2">{member.peopleFields.position}</p>
                        )}
                        {member.categories?.nodes?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {member.categories.nodes.slice(0, 2).map((cat: any) => (
                              <span
                                key={cat.slug}
                                className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                              >
                                {cat.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
                {team.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No team members found.</p>
                  </div>
                )}
                    {team.length > 0 && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setLimit3((prev) => prev + 6)}
          className="px-6 py-2 border-black  text-blue-400 text-4xl transition hover:text-blue-500"
        >
          +
        </button>
      </div>
    )}
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Job Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.map((job: any) => (
                    <a
                      key={job.id}
                      href={`/Jobs/${job.slug}`}
                      className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-100 to-gray-200 h-64"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a72bd]-600/90 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        {job.jobFields?.tileLabel && (
                          <div className="text-xs font-medium text-[#0a72bd]-200 mb-1 uppercase tracking-wider">
                            {job.jobFields.tileLabel}
                          </div>
                        )}
                        <h4 className="text-lg font-bold mb-2 line-clamp-2">
                          {job.jobFields?.tileTitle || job.title}
                        </h4>
                        {job.jobFields?.introduction && (
                          <p className="text-sm text-[#0a72bd]-100 line-clamp-1">
                            📍 {job.jobFields.introduction}
                          </p>
                        )}
                      </div>
                      {job.featuredImage?.node?.sourceUrl && (
                        <img
                          src={job.featuredImage.node.sourceUrl}
                          alt={job.featuredImage.node.altText || job.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0a72bd] text-white shadow-lg">
                          APPLY NOW
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
                {jobs.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No job opportunities available at the moment.</p>
                    <a
                      href="/Career?category=Jobs"
                      className="inline-flex items-center px-4 py-2 bg-[#0a72bd]-600 text-white text-sm font-medium rounded-lg hover:bg-[#0a72bd]-700 transition-colors"
                    >
                      Browse All Jobs
                    </a>
                  </div>
                )}
    {team.length > 0 && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setLimit1((prev) => prev + 6)}
          className="px-6 py-2 border-black  text-blue-400 text-4xl transition hover:text-blue-500"
        >
          +
        </button>
      </div>
    )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
