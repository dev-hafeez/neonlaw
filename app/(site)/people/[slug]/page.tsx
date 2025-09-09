import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { wpFetch } from "@/lib/api/fetcher";
import PersonProfile from "@/components/people/PersonProfile"; // <-- NEW

export const revalidate = 60;

const QUERY = `
  query Person($slug: ID!) {
    person(id: $slug, idType: SLUG) {
      title
      slug
      content
      excerpt
      featuredImage { node { sourceUrl altText } }
      peopleFields {
        position
        email
        linkedin
        office
        headline
        spotify
        introLeft
        introRight
        headshot { 
          node { 
            sourceUrl 
            altText 
          } 
        }
        assistant { name email phone }
        qualifications
        work
        education
      }
      categories { nodes { name slug } }
    }
  }
`;

function stripHtml(s?: string | null) {
  return (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugLower = slug.toLowerCase();
  const json = await wpFetch(QUERY, { slug: slugLower });
  const p = json?.data?.person;
  if (!p) return { title: "Person not found" };

  const title = p.title as string;
  const desc = stripHtml(p.excerpt) || undefined;
  const img =
    p?.peopleFields?.headshot?.node?.sourceUrl ||
    p?.featuredImage?.node?.sourceUrl ||
    undefined;

  return {
    title,
    description: desc,
    openGraph: { title, description: desc, images: img ? [{ url: img }] : undefined },
    twitter: { card: "summary_large_image", title, description: desc, images: img ? [img] : undefined },
  };
}

export default async function PersonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const slugLower = slug.toLowerCase();
  const json = await wpFetch(QUERY, { slug: slugLower });
  const p = json?.data?.person;
  if (!p) return notFound();

  return <PersonProfile person={p} />; // <-- use new component
}
