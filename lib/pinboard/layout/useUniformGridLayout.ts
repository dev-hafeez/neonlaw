import { useMemo } from "react";
import { GAP_Y } from "@/lib/pinboard/constants";

export function useUniformGridLayout<T>(
  cards: T[],
  columns: number,
  tileHeight: number
) {
  return useMemo(() => {
    type C = T & { _h:number };
    const cols: C[][] = Array.from({ length: columns }, () => []);
    const cumY: number[][] = Array.from({ length: columns }, () => []);
    let i = 0;
    for (const c of cards as any as C[]) {
      const col = i % columns;
      const idx = Math.floor(i / columns);
      cols[col].push({ ...(c as any), _h: tileHeight });
      cumY[col].push(idx * (tileHeight + GAP_Y));
      i++;
    }
    // every column repeats the same pattern height:
    const colHeights = Array.from({ length: columns }, (_, col) => {
      const count = cols[col].length || 1;
      return count * tileHeight + Math.max(0, count - 1) * GAP_Y;
    });
    return { cols, cumY, colHeights };
  }, [cards, columns, tileHeight]);
}