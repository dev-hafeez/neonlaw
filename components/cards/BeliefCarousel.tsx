"use client";

interface Belief {
  slug: string;
  title: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
  beliefFields?: {
    teaserPrefix?: string;
    teaserTitle?: string;
  };
}

interface BeliefCarouselProps {
  beliefs: Belief[];
}

export default function BeliefCarousel({ beliefs }: BeliefCarouselProps) {
  if (!beliefs.length) return null;

  const scrollLeft = () => {
    const container = document.getElementById('beliefs-scroll');
    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    const container = document.getElementById('beliefs-scroll');
    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white">
      <div className="w-full px-12">
        <h2 className="text-2xl font-bold text-[#0a72bd] mb-12 text-center">More Beliefs</h2>
        
        <div className="relative">
          {/* Navigation Arrows */}
          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={scrollLeft}
            aria-label="Scroll left"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            onClick={scrollRight}
            aria-label="Scroll right"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Scrollable Container */}
          <div 
            id="beliefs-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {beliefs.map((b: any) => (
              <a 
                key={b.slug} 
                href={`/about/${b.slug}`} 
                className="group relative block  overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 w-80 h-78"
              >
                {/* Background Image or Gradient */}
                {b.featuredImage?.node?.sourceUrl ? (
                  <img
                    src={b.featuredImage.node.sourceUrl}
                    alt={b.featuredImage.node.altText || b.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100" />
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  {b.beliefFields?.teaserPrefix && (
                    <p className="text-sm font-medium opacity-90 mb-2 uppercase tracking-wide">
                      {b.beliefFields.teaserPrefix}
                    </p>
                  )}
                  <h3 className="text-xl font-bold leading-tight mb-4">
                    {b.beliefFields?.teaserTitle || b.beliefFields?.teaserTitle || b.title}
                  </h3>
                </div>
                
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
