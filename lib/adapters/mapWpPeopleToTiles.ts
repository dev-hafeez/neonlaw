export type Tile = {
  categories: any;
  id: string;           // you already navigate with /tile/${id}
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  height?: string;
  type?: string;
  hasButton?: boolean;
  buttonText?: string;
  badge?: string;
};

const strip = (html?: string) =>
  (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export function mapWpPeopleToTiles(people: any[]): Tile[] {
  return people.map((p: any) => ({
    // IMPORTANT: keep id = slug so your existing /tile/${id} works
    id: p.slug,
    title: p.title,
    subtitle: p?.peopleFields?.position || '',
    description: strip(p?.excerpt) || '',   // or strip(p?.peopleFields?.shortBio)
    image: p?.featuredImage?.node?.sourceUrl || '/placeholder.svg',
    badge: p?.categories?.nodes?.[0]?.name || '', // chip text
    hasButton: false,
    type: 'person',                         // (optional) helps your /tile page branch
    categories: p?.categories?.nodes ?? [],
  }));
}
