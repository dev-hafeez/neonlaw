'use client';
import useSWRInfinite from 'swr/infinite';
import { mapWpBeliefsToTiles, BeliefTile } from '@/lib/adapters/mapWpBeliefsToTiles';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const PAGE = 18;

export function useWpBeliefs(q: string = '', category: string = '') {
  const { data, setSize, isLoading, error } = useSWRInfinite(
    (index, prev) => {
      if (prev && !prev.hasNextPage) return null;

      const cursor =
        index && prev?.pageInfo?.endCursor
          ? `&cursor=${encodeURIComponent(prev.pageInfo.endCursor)}`
          : '';

      const catParam = category ? `&cat=${encodeURIComponent(category)}` : '';
      const search = q ? `&q=${encodeURIComponent(q)}` : '';

      return `/api/beliefs?limit=${PAGE}${catParam}${search}${cursor}`;
    },
    fetcher,
    { revalidateFirstPage: false }
  );

  const pages = data ?? [];
  const beliefs = pages.flatMap((p: any) => p.nodes ?? []);
  const tiles: BeliefTile[] = mapWpBeliefsToTiles(beliefs);
  const hasMore = pages.at(-1)?.hasNextPage ?? false;

  return { tiles, hasMore, setSize, isLoading, error };
}
