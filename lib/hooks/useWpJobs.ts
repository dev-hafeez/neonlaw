'use client';
import useSWRInfinite from 'swr/infinite';
import { mapWpJobsToTiles, JobTile } from '@/lib/adapters/mapWpJobsToTiles';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const PAGE = 18;

export function useWpJobs(q: string = '', category: string = '') {
  const { data, setSize, isLoading, error } = useSWRInfinite(
    (index, prev) => {
      if (prev && !prev.hasNextPage) return null;

      const cursor =
        index && prev?.pageInfo?.endCursor
          ? `&cursor=${encodeURIComponent(prev.pageInfo.endCursor)}`
          : '';

      const catParam = category ? `&cat=${encodeURIComponent(category)}` : '';
      const search = q ? `&q=${encodeURIComponent(q)}` : '';

      return `/api/jobs?limit=${PAGE}${catParam}${search}${cursor}`;
    },
    fetcher,
    { revalidateFirstPage: false }
  );

  const pages = data ?? [];
  const jobs = pages.flatMap((p: any) => p.nodes ?? []);
  const tiles: JobTile[] = mapWpJobsToTiles(jobs);
  const hasMore = pages.at(-1)?.hasNextPage ?? false;

  return { tiles, hasMore, setSize, isLoading, error };
}
