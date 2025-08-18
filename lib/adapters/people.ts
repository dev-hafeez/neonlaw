export type Tile = {
  id: string;                 // we'll use slug here
  title: string;
  subtitle?: string;          // position
  image?: string;             // featured image url
  href: string;               // where to navigate
  excerpt?: string | null;
  chips?: { label: string; href: string }[];
  featured?: boolean;
  weight?: number;
};

export function mapPersonToTile(p: any): Tile {
  const img = p?.featuredImage?.node;
  const cats = p?.categories?.nodes ?? [];
  return {
    id: p.slug, // important: use slug so we can route to /people/[slug]
    title: p.title,
    subtitle: p?.peopleFields?.position || "",
    image: img?.sourceUrl,
    href: `/people/${p.slug}`,
    excerpt: p?.excerpt ?? null,
    chips: cats.map((c: any) => ({ label: c.name, href: `/people?cat=${c.slug}` })),
    featured: !!p?.peopleFields?.featured,
    weight: Number(p?.peopleFields?.weight ?? 9999),
  };
}
