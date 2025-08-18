// lib/pinboard/layout/useMasonryLayout.ts
import { useMemo } from "react";
import { GAP_Y } from "@/lib/pinboard/constants";

type HeightsMap = Record<string, number>;

/**
 * Masonry layout calculator
 *
 * @param cards             items to lay out (must have id + height class)
 * @param colCount          number of columns
 * @param measuredHeights   actual DOM heights (by id)
 * @param fallbackPx        OPTIONAL map of tailwind height classes -> px, e.g. { "h-48": 192 }
 */
export function useMasonryLayout<T extends { id: string; height: string }>(
  cards: T[],
  colCount: number,
  measuredHeights: HeightsMap = {},
  fallbackPx?: Record<string, number> // <- optional so 3 or 4 args both work
) {
  type WithH = T & { _h: number };

  return useMemo(() => {
    const cols: WithH[][] = Array.from({ length: colCount }, () => []);
    const cumY: number[][] = Array.from({ length: colCount }, () => []);
    const running: number[] = new Array(colCount).fill(0);

    const items: WithH[] = cards.map((c) => {
      // real measured height wins; otherwise try fallback map by tailwind class
      const byId = measuredHeights[c.id];
      const byClass =
        fallbackPx && typeof c.height === "string"
          ? (fallbackPx as any)[c.height] ?? undefined
          : undefined;
      const h = byId ?? byClass ?? 256; // last-ditch default
      return { ...(c as T), _h: h };
    });

    for (const it of items) {
      // put into the shortest column
      let k = 0;
      for (let i = 1; i < colCount; i++) if (running[i] < running[k]) k = i;

      cols[k].push(it);
      cumY[k].push(running[k]);
      running[k] += it._h + GAP_Y;
    }

    // total height per column pattern (used for vertical tiling)
    const colHeights = running.map((h) => (h === 0 ? 1 : h));

    return { cols, cumY, colHeights };
  }, [cards, colCount, measuredHeights, fallbackPx]);
}
