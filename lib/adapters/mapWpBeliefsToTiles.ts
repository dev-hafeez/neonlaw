export type BeliefTile = {
  id: string;           // you use this in Link `/about/${id}`
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

export function mapWpBeliefsToTiles(beliefs: any[]): BeliefTile[] {
  return beliefs.map((b: any) => {
    return {
      id: b.slug,                                  // keep your /about/${id}
      title: b.beliefFields?.teaserTitle || b.title,
      subtitle: b.beliefFields?.teaserPrefix || 'We believe in',
      description: strip(b.beliefFields?.introLeft || b.excerpt),
      image: b.featuredImage?.node?.sourceUrl || '/placeholder.svg',
      height: '220px', // Standard tile height
      badge: b.beliefFields?.teaserPrefix || 'We believe in', // blue chip you show on cards
      hasButton: false,
      buttonText: '',
    };
  });
}
