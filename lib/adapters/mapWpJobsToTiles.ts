export type JobTile = {
  id: string;           // you use this in Link `/Jobs/${id}`
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

export function mapWpJobsToTiles(jobs: any[]): JobTile[] {
  return jobs.map((j: any) => {
    return {
      id: j.slug,                                  // keep your /Jobs/${id}
      title: j.jobFields?.tileTitle || j.title,
      subtitle: j.jobFields?.tileLabel || 'Career',
      description: strip(j.jobFields?.introduction || j.excerpt),
      image: j.featuredImage?.node?.sourceUrl || '/placeholder.svg',
      height: '220px', // Standard tile height
      badge: 'Apply Now', // Jobs always have apply now badge
      hasButton: true,
      buttonText: 'APPLY NOW',
    };
  });
}
