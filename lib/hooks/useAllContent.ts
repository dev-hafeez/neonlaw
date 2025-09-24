'use client';
import { useMemo, useState, useEffect } from 'react';

export type UnifiedTile = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  height?: string;
  type: 'post' | 'belief' | 'job' | 'person';
  hasButton?: boolean;
  buttonText?: string;
  badge?: string;
  categories?: any[];
  route: string; // The route to navigate to
};

export function useAllContent(q: string = '', cats: (string | number)[] = []) {
  const [staticTiles, setStaticTiles] = useState<UnifiedTile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pre-render limited content from each category
  useEffect(() => {
    const fetchStaticContent = async () => {
      setIsLoading(true);
      
      try {
        // Fetch limited content from each API (6 items each)
        const [postsRes, beliefsRes, jobsRes, peopleRes] = await Promise.all([
          fetch('/api/posts?limit=6'),
          fetch('/api/beliefs?limit=6'),
          fetch('/api/jobs?limit=6'),
          fetch('/api/people?limit=6')
        ]);

        const [postsData, beliefsData, jobsData, peopleData] = await Promise.all([
          postsRes.json(),
          beliefsRes.json(),
          jobsRes.json(),
          peopleRes.json()
        ]);

        const allTiles: UnifiedTile[] = [];

        // Add posts
        if (postsData?.nodes) {
          postsData.nodes.forEach((post: any) => {
            allTiles.push({
              id: post.slug,
              title: post.title,
              subtitle: '',
              description: stripHtml(post.excerpt),
              image: post.featuredImage?.node?.sourceUrl || '/placeholder.svg',
              badge: post.categories?.nodes?.[0]?.name || '',
              hasButton: false,
              type: 'post' as const,
              route: `/tile/${post.slug}`,
            });
          });
        }

        // Add beliefs
        if (beliefsData?.nodes) {
          beliefsData.nodes.forEach((belief: any) => {
            allTiles.push({
              id: belief.slug,
              title: belief.beliefFields?.teaserTitle || belief.title,
              subtitle: belief.beliefFields?.teaserPrefix || 'We believe in',
              description: stripHtml(belief.beliefFields?.introLeft || belief.excerpt),
              image: belief.featuredImage?.node?.sourceUrl || '/placeholder.svg',
              badge: belief.beliefFields?.teaserPrefix || 'We believe in',
              hasButton: false,
              type: 'belief' as const,
              route: `/about/${belief.slug}`,
            });
          });
        }

        // Add jobs
        if (jobsData?.nodes) {
          jobsData.nodes.forEach((job: any) => {
            allTiles.push({
              id: job.slug,
              title: job.jobFields?.tileTitle || job.title,
              subtitle: job.jobFields?.tileLabel || 'Career',
              description: stripHtml(job.jobFields?.introduction || job.excerpt),
              image: job.featuredImage?.node?.sourceUrl || '/placeholder.svg',
              badge: 'Apply Now',
              hasButton: true,
              buttonText: 'APPLY NOW',
              type: 'job' as const,
              route: `/Jobs/${job.slug}`,
            });
          });
        }

        // Add people
        if (peopleData?.nodes) {
          peopleData.nodes.forEach((person: any) => {
            allTiles.push({
              id: person.slug,
              title: person.title,
              subtitle: person.peopleFields?.position || '',
              description: stripHtml(person.excerpt) || '',
              image: person.featuredImage?.node?.sourceUrl || '/placeholder.svg',
              badge: person.categories?.nodes?.[0]?.name || '',
              hasButton: false,
              type: 'person' as const,
              route: `/people/${person.slug}`,
            });
          });
        }

        // Shuffle the tiles for better visual distribution
        setStaticTiles(shuffleArray(allTiles));
      } catch (error) {
        console.error('Error fetching static content:', error);
        setStaticTiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaticContent();
  }, []); // Empty dependency array - only fetch once on mount

  return {
    tiles: staticTiles,
    hasMore: false, // No infinite scrolling
    setSize: () => {}, // No-op function
    isLoading,
  };
}

// Utility function to strip HTML tags
function stripHtml(html?: string): string {
  return (html || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

// Utility function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
