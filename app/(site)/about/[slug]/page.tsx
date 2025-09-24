"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import BeliefCard from "@/components/cards/BeliefCard";
import BeliefCarousel from "@/components/cards/BeliefCarousel";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import ScrollIcon from "@/components/ui/ScrollIcon";
import PageFooter from "@/components/layout/PageFooter";
import Footer from '@/components/layout/Footer';

function stripHtml(s?: string | null) {
  return (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default function BeliefPage({ params }: { params: Promise<{ slug: string }> }) {
  const [belief, setBelief] = useState<any>(null);
  const [more, setMore] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
        
        const [beliefResponse, moreResponse] = await Promise.all([
          fetch(`/api/beliefs/${resolvedParams.slug}`),
          fetch('/api/beliefs?limit=8')
        ]);
        
        if (!beliefResponse.ok) {
          throw new Error('Belief not found');
        }
        
        const beliefData = await beliefResponse.json();
        const moreData = await moreResponse.json();
        
        if (!beliefData) {
          notFound();
          return;
        }
        
        setBelief(beliefData);
        const filteredMore = (moreData?.nodes || [])
          .filter((n: any) => n.slug !== resolvedParams.slug);
        setMore(filteredMore);
      } catch (error) {
        console.error('Error fetching belief data:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading belief details...</p>
        </div>
      </main>
    );
  }

  if (!belief) {
    return notFound();
  }

  const heroTitle = belief.beliefFields?.heroTitle || belief.beliefFields?.teaserTitle || belief.title;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[100vh] md:h-[100vh] bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
        {/* X Close Button */}
        <button
          onClick={() => window.history.back()}
          className="absolute top-6 right-6 z-50 bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-xl transition-all duration-300 hover:scale-110 shadow-lg"
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

        {belief.featuredImage?.node?.sourceUrl && (
          <div className="absolute inset-0">
            <img
              src={belief.featuredImage.node.sourceUrl}
              alt={belief.featuredImage.node.altText || belief.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          </div>
        )}
        
        <div className="relative h-full flex items-end">
          <div className="w-full pb-20 pl-12">
            <div className="flex flex-col max-w-2xl">
              <span className="text-white/90 text-4xl md:text-4xl font-medium tracking-wide uppercase">
                We believe in
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
                {heroTitle}
              </h1>
            </div>
          </div>
        </div>
        
        {/* Scroll Down Mouse Icon */}
        <ScrollIcon />
      </section>

      {/* Breadcrumb */}
      <section className="py-6 bg-gray-50 border-b">
        <div className="w-full px-12">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="font-medium">{belief.title}</span>
          </nav>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-white">
        <div className="w-full px-12">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                At NEON, we see each case as a blank canvas, a setting to create perfectly fitting solutions for our clients.
              </h2>
            </div>
            <div className="text-lg leading-relaxed text-gray-700">
              {belief.beliefFields?.introLeft && (
                <p>{belief.beliefFields.introLeft}</p>
              )}
              {belief.beliefFields?.introRight && (
                <p>{belief.beliefFields.introRight}</p>
              )}
              {!belief.beliefFields?.introLeft && !belief.beliefFields?.introRight && (
                <p>
                  Our commitment to honesty, creativity, and supreme quality underpins our pursuit of 
                  perfection and excellence. We always strive to be among the best, focusing on specialized, 
                  high-quality, and collaborative solutions for every unique challenge.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* More Beliefs Carousel */}
      {more.length > 0 && (
        <>
          <BeliefCarousel beliefs={more} />
        </>
      )}
      
      {/* Scroll to Top Section */}
      <section className="py-6 bg-white">
        <div className="w-full px-12">
          <div className="flex justify-end">
            <ScrollToTopButton />
          </div>
        </div>
      </section>
      
      <PageFooter />
    </main>
  );
}
