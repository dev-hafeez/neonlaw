export type Tile = {
    id: string;           // you use this in Link `/tile/${id}`
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
  
  export function mapWpPostsToTiles(posts: any[]): Tile[] {
    return posts.map((p: any) => ({
      id: p.slug,                                  // keep your /tile/${id}
      title: p.title,
      subtitle: '',                                // or use first category if you want
      description: strip(p.excerpt),
      image: p.featuredImage?.node?.sourceUrl || '/placeholder.svg',
      badge: p.categories?.nodes?.[0]?.name || '', // blue chip you show on cards
      hasButton: false,
    }));
  }
  