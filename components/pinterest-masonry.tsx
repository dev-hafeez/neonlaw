// components/pinterest-masonry.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PinterestCard from "./pinterest-card";

import { useViewport } from "@/lib/pinboard/hooks/useViewport";
import { useScrollState } from "@/lib/pinboard/hooks/useScrollState";
import { useScrollerControls } from "@/lib/pinboard/hooks/useScrollerControls";
import { useInfinitePlane } from "@/lib/pinboard/hooks/useInfinitePlane";

import { PLANE_W, PLANE_H, COL_BUFFER, ROW_BUFFER } from "@/lib/pinboard/constants";
import { baseCardData } from "@/lib/pinboard/data";

/** ─ Layout knobs */
const TILE_W = 268;     // change to taste
const TILE_H = 220;
const GAP_X  = 24;
const GAP_Y  = 24;

const COLUMN_WIDTH = TILE_W;
const STRIDE_X     = COLUMN_WIDTH + GAP_X;

function bucketize<T>(items: T[], columns: number): T[][] {
  const cols: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item));
  return cols;
}

function buildCumY(count: number, step: number) {
  return Array.from({ length: count }, (_, i) => i * step);
}

export default function PinterestMasonry() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  const { w: vw, h: vh } = useViewport(scrollerRef);

  const [columns, setColumns] = useState(4);
  useEffect(() => {
    const w = scrollerRef.current?.clientWidth ?? vw;
    if (!w) return;
    const maxCols = Math.max(2, Math.min(8, Math.floor((w + GAP_X) / STRIDE_X)));
    setColumns(maxCols);
  }, [vw]);

  const { targetRef } = useScrollerControls(scrollerRef);
  const scroll = useScrollState(scrollerRef);
  const { virtualX, virtualY, originX, originY } =
    useInfinitePlane(scrollerRef, vw, vh, scroll, targetRef);

  const colBuckets = useMemo(() => bucketize(baseCardData, columns), [columns]);
  const rowStep = TILE_H + GAP_Y;

  const cumYPerCol = useMemo(
    () => colBuckets.map((col) => buildCumY(col.length, rowStep)),
    [colBuckets, rowStep]
  );

  const patternHPerCol = useMemo(
    () => colBuckets.map((col) => Math.max(rowStep, col.length * rowStep)),
    [colBuckets, rowStep]
  );

  // Stagger columns for the "neon.law" look
  const columnOffsets = useMemo(() => {
    const unit = Math.round(TILE_H / 3); // ~ one third of a tile
    return Array.from({ length: columns }, (_, k) => (k % 3) * unit);
  }, [columns]);

  const firstCol = Math.floor(virtualX / STRIDE_X) - COL_BUFFER;
  const visColCount = Math.ceil(vw / STRIDE_X) + COL_BUFFER * 2;

  return (
    <div ref={scrollerRef} className="fixed inset-0 overflow-auto">
      <div ref={planeRef} className="relative" style={{ width: PLANE_W, height: PLANE_H }}>
        {Array.from({ length: visColCount }).map((_, i) => {
          const colIndex = firstCol + i;
          const baseCol = ((colIndex % columns) + columns) % columns;
          const x = Math.round(colIndex * STRIDE_X - originX.current);

          const colCards = colBuckets[baseCol] ?? [];
          const cumY = cumYPerCol[baseCol] ?? [];
          const patternH = patternHPerCol[baseCol] || rowStep;
          const yOffset = columnOffsets[baseCol] || 0;

          // shift the repeat computation by the column's offset
          const shiftedVirtualY = virtualY - yOffset;
          const firstRepeat = Math.floor(shiftedVirtualY / patternH) - ROW_BUFFER;
          const repeatCount = Math.ceil(vh / patternH) + ROW_BUFFER * 2;

          return (
            <div
              key={`col-${colIndex}`}
              className="absolute top-0"
              style={{ left: x, width: COLUMN_WIDTH }}
            >
              {Array.from({ length: repeatCount }).flatMap((__, ry) => {
                const rep = firstRepeat + ry;
                const yBase = rep * patternH;

                return colCards.map((card: any, idx: number) => {
                  const y = Math.round(yBase + yOffset + cumY[idx] - originY.current);
                  return (
                    <div
                      key={`tile-${colIndex}-${rep}-${card.id}-${idx}`}
                      className="absolute m-0 p-0 [&>*]:m-0"
                      style={{
                        top: y,
                        width: COLUMN_WIDTH,
                        height: TILE_H,
                        willChange: "transform",
                        transform: "translateZ(0)",
                      }}
                    >
                      <PinterestCard {...card} />
                    </div>
                  );
                });
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
