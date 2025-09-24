"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR from "swr";
import PinterestCard from "../cards/PinterestCard";
import Footer from "../layout/Footer";

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
  const [showFooter, setShowFooter] = useState(false);
  const [showEmailContainer, setShowEmailContainer] = useState(false);
  const [showLinkedInContainer, setShowLinkedInContainer] = useState(false);

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

  // Scroll detection for footer visibility
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

  return (
    <main className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative h-screen bg-white overflow-hidden">
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

  {/* X Close Button */}
  <button
    onClick={() => window.history.back()}
    className="absolute top-6 right-6 z-50 bg-blue-400 backdrop-blue-400 text-white p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
    aria-label="Close"
  >
    <svg 
      className="w-6 h-6" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      strokeWidth={2.5}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M6 18L18 6M6 6l12 12" 
      />
    </svg>
  </button>

  {/* Top-right buttons */}
  <div className="fixed top-6 left-6 z-20 flex flex-wrap items-center gap-3">
    <div className="flex items-center gap-3">
  {pf.email && (
    <div 
      className="relative group ml-10"
      onMouseEnter={() => setShowEmailContainer(true)}
      onMouseLeave={() => setShowEmailContainer(false)}
    >
      <a 
        href={`mailto:${pf.email}`}
        className="flex items-center justify-center w-14 h-14 bg-white text-[#0a72bd] border border-4 border-[#0a72bd] rounded-xl hover:bg-[#0a72bd] transition-all duration-300 hover:text-white hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 
                   2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 
                   4-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      </a>
      
      {/* Sliding Email Container */}
      <div className={`absolute left-full top-0 ml-2 bg-white border border-[#0a72bd] rounded-xl shadow-lg transition-all duration-300 ease-in-out transform ${
        showEmailContainer 
          ? 'translate-x-0 opacity-100 scale-100' 
          : '-translate-x-4 opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-[#0a72bd]">Contact</h4>
          </div>
          <div className="space-y-2">
            <a 
              href={`mailto:${pf.email}`}
              className="block w-full text-left px-3 py-2 bg-[#0a72bd] text-white rounded-lg hover:bg-[#085a96] transition-colors text-sm"
            >
              📧 {pf.email}
            </a>
            {pf.assistant?.email && (
              <a 
                href={`mailto:${pf.assistant.email}`}
                className="block w-full text-left px-3 py-2 bg-gray-100 text-[#0a72bd] rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                👤 {pf.assistant.email}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
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
    <div 
      className={`relative group transition-all duration-300 ease-in-out ${
        showEmailContainer ? 'translate-x-[220px]' : 'translate-x-0'
      }`}
      onMouseEnter={() => setShowLinkedInContainer(true)}
      onMouseLeave={() => setShowLinkedInContainer(false)}
    >
      <a 
        href={pf.linkedin} 
        target="_blank" 
        rel="noreferrer"
        className="flex items-center text-4xl font-black justify-center w-14 h-14 bg-white text-[#0a72bd] border border-[#0a72bd] border-4 rounded-xl hover:bg-[#0a72bd] transition-all duration-300 hover:text-white hover:scale-110"
      >
        in
      </a>
      
      {/* Sliding LinkedIn Container */}
      <div className={`absolute left-full top-0 ml-2 bg-white border border-[#0a72bd] rounded-xl shadow-lg transition-all duration-300 ease-in-out transform ${
        showLinkedInContainer 
          ? 'translate-x-0 opacity-100 scale-100' 
          : '-translate-x-4 opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-[#0a72bd]">LinkedIn</h4>
          </div>
          <div className="space-y-2">
            <a 
              href={pf.linkedin}
              target="_blank"
              rel="noreferrer"
              className="block w-full text-left px-3 py-2 bg-[#0a72bd] text-white rounded-lg hover:bg-[#085a96] transition-colors text-sm"
            >
              🔗 {pf.linkedin}
            </a>
          </div>
        </div>
      </div>
    </div>
  )}

 {pf.spotify && (
  <div className={`relative group transition-all duration-300 ease-in-out ${
    showEmailContainer || showLinkedInContainer ? 'translate-x-[220px]' : 'translate-x-0'
  }`}>
    <a 
      href={pf.spotify} 
      target="_blank" 
      rel="noreferrer"
      className="flex items-center justify-center w-50 h-12 bg-white text-black shadow-md rounded-xl hover:text-white hover:bg-black transition-all duration-300 hover:translate-x-1"
    >
      <div className="mr-5 font-bold">What i listen to</div>
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
    {/* Spotify Tooltip */}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
      {pf.spotify}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
    </div>
  </div>
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
        <p className="text-white/90 text-lg md:text-2xl uppercase tracking-wider font-semibold mb-0">
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
        <section className="py-8 bg-white">
  <div className="">
    <h2 className="w-full text-2xl md:text-4xl lg:text-5xl font-black  text-gray-900 leading-relaxed text-left">
      "{pf.headline}"
    </h2>
  </div>
</section>

      )}

      <section className="bg-white text-left">
  <div className="w-full px-6">
    {/* Main Content - Two Column Layout */}
    {(pf.introLeft || pf.introRight || person.content) && (
      <div className="grid gap-12 md:grid-cols-2 mb-12 w-ful text-justifyl">
        <div className="">
          {pf.introLeft && (
            <div className="text-lg leading-relaxed  text-justify">
              {pf.introLeft}
            </div>
          )}
          {person.content && !pf.introLeft && (
            <article 
              className="prose prose-xl max-w-none text-gray-700 leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: person.content }} 
            />
          )}
        </div>
        <div className="space-y-6">
          {pf.introRight && (
            <div className="text-lg leading-relaxed  text-justify">
              {pf.introRight}
            </div>
          )}
        </div>
      </div>
    )}

    {/* Excerpt as fallback */}
    {!pf.introLeft && !pf.introRight && !person.content && person.excerpt && (
      <div 
        className="prose prose-xl max-w-none mb-12 text-gray-700 leading-relaxed" 
        dangerouslySetInnerHTML={{ __html: person.excerpt }} 
      />
    )}
  </div>
</section>


      {/* ABOUT SECTION */}
      <section className="font-semiboldpy-12 md:py-20 bg-white">
        <div className="w-full px-6">
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
          <div className="relative group">
            <a 
              className="flex items-center justify-center w-12 h-12 bg-white text-[#0a72bd] border border-[#0a72bd] rounded-xl hover:bg-[#085a96] transition-all duration-300 hover:text-white hover:scale-110"
              href={`mailto:${pf.assistant.email}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4C2.9 4 2 4.9 2 6v12c0 1.1.9 2 
                         2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 
                         4-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
            {/* Assistant Email Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              {pf.assistant.email}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
            </div>
          </div>
        )}

        {pf.assistant?.phone && (
          <div className="relative group">
            <a 
              className="flex items-center justify-center w-12 h-12 bg-white text-[#0a72bd] border border-[#0a72bd] rounded-xl hover:bg-[#085a96] transition-all duration-300 hover:text-white hover:translate-x-1 ml-2"
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
            {/* Assistant Phone Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
              {pf.assistant.phone}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-800"></div>
            </div>
          </div>
        )}

      </div>
    </div>
  )}
</div>
</div>
      </section>

      {/* TABS SECTION */}
      <section className="py-12 w-full bg-white">
        <div className="w-full mx-auto px-6">
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
              <div className="">
                {allContent.length > 0 ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {allContent.map((item: any) => (
                        <PinterestCard
                          key={item.id}
                          id={item.slug}
                          title={item.title}
                          subtitle={item.categories?.nodes?.[0]?.name}
                          description={item.excerpt ? item.excerpt.replace(/<[^>]+>/g, '') : undefined}
                          image={item.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=300&width=250"}
                          height="300px"
                          // You can add more props as needed
                        />
                      ))}
                    </div>
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={() => setLimit4((prev) => prev + 6)}
                        className="px-6 py-2 border-black  text-blue-400 text-4xl transition hover:text-blue-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
                      <div className="text-gray-500 text-lg font-medium mb-2">Under Development</div>
                      <p className="text-gray-400 text-sm">This section is currently being developed and will be available soon.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'deals' && (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {deals.map((deal: any) => (
        <PinterestCard
          key={deal.id}
          id={deal.slug}
          title={deal.title}
          subtitle={deal.categories?.nodes?.[0]?.name}
          description={deal.excerpt ? deal.excerpt.replace(/<[^>]+>/g, '') : undefined}
          image={deal.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=300&width=250"}
          height="300px"
        />
      ))}
    </div>
    {deals.length === 0 && (
      <div className="text-center py-12">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-gray-500 text-lg font-medium mb-2">Under Development</div>
          <p className="text-gray-400 text-sm">This section is currently being developed and will be available soon.</p>
        </div>
      </div>
    )}
    {deals.length > 0 && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setLimit2((prev) => prev + 4)}
          className="px-6 py-2 border-black text-blue-400 text-4xl transition hover:text-blue-500"
        >
          +
        </button>
      </div>
    )}
  </div>
)}

{activeTab === 'team' && (
  <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {team.map((member: any) => (
        <PinterestCard
          key={member.id}
          id={member.slug}
          title={member.title}
          subtitle={member.peopleFields?.position}
          description={member.peopleFields?.headline}
          image={
            member.peopleFields?.headshot?.node?.sourceUrl ||
            member.featuredImage?.node?.sourceUrl ||
            "/placeholder.svg?height=300&width=250"
          }
          height="300px"
        />
      ))}
    </div>
    {team.length === 0 && (
      <div className="text-center py-12">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-gray-500 text-lg font-medium mb-2">Under Development</div>
          <p className="text-gray-400 text-sm">This section is currently being developed and will be available soon.</p>
        </div>
      </div>
    )}
    {team.length > 0 && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setLimit3((prev) => prev + 6)}
          className="px-6 py-2 border-black text-blue-400 text-4xl transition hover:text-blue-500"
        >
          +
        </button>
      </div>
    )}
  </div>
)}

{activeTab === 'jobs' && (
  <div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job: any) => (
        <PinterestCard
          key={job.id}
          id={job.slug}
          title={job.jobFields?.tileTitle || job.title}
          subtitle={job.jobFields?.tileLabel}
          description={job.jobFields?.introduction}
          image={job.featuredImage?.node?.sourceUrl || "/placeholder.svg?height=300&width=250"}
          height="300px"
          hasButton
          buttonText="APPLY NOW"
        />
      ))}
    </div>
    {jobs.length === 0 && (
      <div className="text-center py-12">
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8">
          <div className="text-gray-500 text-lg font-medium mb-2">Under Development</div>
          <p className="text-gray-400 text-sm mb-4">This section is currently being developed and will be available soon.</p>
          <a
            href="/Career?category=Jobs"
            className="inline-flex items-center px-4 py-2 bg-[#0a72bd] text-white text-sm font-medium rounded-lg hover:bg-[#085a96] transition-colors"
          >
            Browse All Jobs
          </a>
        </div>
      </div>
    )}
    {jobs.length > 0 && (
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setLimit1((prev) => prev + 6)}
          className="px-6 py-2 border border-2 border-[#0a72bd] rounded-full text-blue-400 text-4xl transition hover:text-blue-500"
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
      {/* Footer - Only visible when reaching the end */}
      {showFooter && <Footer />}
    </main>
  );
}
