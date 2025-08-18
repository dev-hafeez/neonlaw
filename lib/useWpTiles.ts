'use client';
import useSWRInfinite from 'swr/infinite';
import { mapWpPostsToTiles, Tile } from './mapWpToTile';

const fetcher = (url: string) => fetch(url).then(r => r.json());
const PAGE = 18;

export function useWpTiles(q = '', cats: (number|string)[] = []) {
  const { data, setSize, isLoading, error } = useSWRInfinite(
    (index, prev) => {
      if (prev && !prev.hasNextPage) return null;
      const cursor = index && prev?.pageInfo?.endCursor ? `&cursor=${encodeURIComponent(prev.pageInfo.endCursor)}` : '';
      const cat = cats.map(c => `&cat=${c}`).join('');
      const search = q ? `&q=${encodeURIComponent(q)}` : '';
      return `/api/posts?limit=${PAGE}${cat}${search}${cursor}`;
    },
    fetcher,
    { revalidateFirstPage: false }
  );

  const pages = data ?? [];
  const posts = pages.flatMap((p: any) => p.nodes ?? []);
  const tiles: Tile[] = mapWpPostsToTiles(posts);
  const hasMore = pages.at(-1)?.hasNextPage ?? false;

  return { tiles, hasMore, setSize, isLoading, error };
}
