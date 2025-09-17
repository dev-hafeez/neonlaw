import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import BeliefCard from "@/components/cards/BeliefCard";
import BeliefCarousel from "@/components/cards/BeliefCarousel";
import ScrollToTopButton from "@/components/ui/ScrollToTopButton";
import ScrollIcon from "@/components/ui/ScrollIcon";
import PageFooter from "@/components/layout/PageFooter";
import { wpFetch } from "@/lib/api/fetcher";

export const revalidate = 60;

const DETAIL_QUERY = `
  query Belief($slug:ID!) {
    belief(id:$slug, idType:SLUG) {
      title
      slug
      beliefFields { teaserPrefix teaserTitle heroTitle introLeft introRight }
      featuredImage { node { sourceUrl altText } }
    }
  }
`;

const MORE_QUERY = `
  query MoreBeliefs($first:Int!) {
    beliefs(first:$first, where:{orderby:{field: DATE, order: DESC}}) {
      nodes {
        slug
        title
        beliefFields { teaserPrefix teaserTitle }
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

function stripHtml(s?: string | null) {
  return (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await wpFetch(DETAIL_QUERY, { slug });
  const b = data?.belief;
  if (!b) return { title: "Belief not found" };

  const title =
    b.beliefFields?.heroTitle ||
    `${b.beliefFields?.teaserPrefix ?? "We believe in"} ${b.beliefFields?.teaserTitle ?? b.title}`;

  const img = b.featuredImage?.node?.sourceUrl as string | undefined;

  return {
    title,
    description: stripHtml(b.beliefFields?.introLeft) || undefined,
    openGraph: { title, images: img ? [{ url: img }] : undefined },
    twitter: { card: "summary_large_image", title, images: img ? [img] : undefined },
  };
}

export default async function BeliefPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await wpFetch(DETAIL_QUERY, { slug });
  const belief = data?.belief;
  if (!belief) return notFound();

  const moreData = await wpFetch(MORE_QUERY, { first: 8 });
  const more = (moreData?.data?.beliefs?.nodes ?? []).filter((n: any) => n.slug !== slug);

  const heroTitle = belief.beliefFields?.heroTitle || belief.beliefFields?.teaserTitle || belief.title;

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[100vh] md:h-[100vh] bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
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
