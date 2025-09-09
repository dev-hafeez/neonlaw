"use client";
import useSWRInfinite from "swr/infinite";
import { mapWpPeopleToTiles, Tile } from "@/lib/adapters/mapWpPeopleToTiles";

const fetcher = (url: string) => fetch(url).then(r => r.json());
const PAGE = 18;

export function usePeopleTiles(q = "", cats: (string | number)[] = [], key = "0") {
  const cat = typeof cats[0] === "string" ? String(cats[0]) : "";
  
  const { data, setSize, isLoading, error } = useSWRInfinite(
    (index, prev) => {
      if (prev && !prev.hasNextPage) return null;
      const cursor = index && prev?.pageInfo?.endCursor ? `&cursor=${encodeURIComponent(prev.pageInfo.endCursor)}` : '';
      const catParam = cat ? `&cat=${encodeURIComponent(cat)}` : '';
      const search = q ? `&q=${encodeURIComponent(q)}` : '';
      return `/api/people?limit=${PAGE}${catParam}${search}${cursor}&key=${key}`;
    },
    fetcher,
    { revalidateFirstPage: false }
  );

  const pages = data ?? [];
  const nodes = pages.flatMap((p: any) => p.nodes ?? []);
  const tiles: Tile[] = mapWpPeopleToTiles(nodes);
  const hasMore = pages.at(-1)?.hasNextPage ?? false;

  // Featured → weight → title (weight lives in peopleFields)
  tiles.sort((a, b) => {
    const af = nodes.find((n:any)=>n.slug===a.id)?.peopleFields?.featured ? 0 : 1;
    const bf = nodes.find((n:any)=>n.slug===b.id)?.peopleFields?.featured ? 0 : 1;
    if (af !== bf) return af - bf;
    const aw = Number(nodes.find((n:any)=>n.slug===a.id)?.peopleFields?.weight ?? 9999);
    const bw = Number(nodes.find((n:any)=>n.slug===b.id)?.peopleFields?.weight ?? 9999);
    if (aw !== bw) return aw - bw;
    return a.title.localeCompare(b.title);
  });

  return {
    tiles,
    hasMore,
    setSize,
    isLoading,
    error,
  };
}
