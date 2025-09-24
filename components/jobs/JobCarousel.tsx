"use client";

interface Job {
  slug: string;
  title: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
  jobFields?: {
    tileLabel?: string;
    tileTitle?: string;
  };
}

interface JobCarouselProps {
  jobs: Job[];
}

export default function JobCarousel({ jobs }: JobCarouselProps) {
  if (!jobs.length) return null;

  const scrollLeft = () => {
    const container = document.getElementById('vacancies-scroll');
    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.getElementById('vacancies-scroll');
    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto mr-8 px-6 ml-8">
        <h2 className="text-2xl font-bold text-[#0a72bd] mb-12 text-center">More Jobs</h2>
        
        <div className="relative">
          {/* Navigation Arrows */}
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div 
            id="vacancies-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-16"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {jobs.map((j: any) => (
              <a 
                key={j.slug} 
                href={`/Jobs/${j.slug}`} 
                className="group relative block overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-80 h-84"
              >
                {/* Background Image or Gradient */}
                {j.featuredImage?.node?.sourceUrl ? (
                  <img
                    src={j.featuredImage.node.sourceUrl}
                    alt={j.featuredImage.node.altText || j.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-100 to-purple-100" />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  {j.jobFields?.tileLabel && (
                    <p className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wide">
                      {j.jobFields.tileLabel}
                    </p>
                  )}
                  <h3 className="text-xl font-bold leading-tight mb-4">
                    {j.jobFields?.tileTitle || j.title}
                  </h3>
                </div>
                
                {/* Apply Now Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-[#0a72bd] text-white text-xs font-bold px-3 py-3 rounded-xl">
                    APPLY NOW
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
