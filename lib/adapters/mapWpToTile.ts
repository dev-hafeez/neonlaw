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
    return posts.map((p: any) => {
      // Check if this is a job-related post
      const isJobPost = p.categories?.nodes?.some((cat: any) => 
        cat.name?.toLowerCase().includes('job') || 
        cat.name?.toLowerCase().includes('career') ||
        cat.name?.toLowerCase().includes('position') ||
        p.title?.toLowerCase().includes('job') ||
        p.title?.toLowerCase().includes('career') ||
        p.title?.toLowerCase().includes('position')
      );
      
      return {
        id: p.slug,                                  // keep your /tile/${id}
        title: p.title,
        subtitle: '',                                // or use first category if you want
        description: strip(p.excerpt),
        image: p.featuredImage?.node?.sourceUrl || '/placeholder.svg',
        badge: isJobPost ? 'Apply Now' : (p.categories?.nodes?.[0]?.name || ''), // blue chip you show on cards
        hasButton: isJobPost, // Show button for job posts
        buttonText: 'APPLY NOW',
      };
    });
  }
  