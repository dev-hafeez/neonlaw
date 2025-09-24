"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import PinterestCard from "@/components/cards/PinterestCard";
import { useViewport } from "@/lib/pinboard/hooks/useViewport";
import { useScrollState } from "@/lib/pinboard/hooks/useScrollState";
import { useScrollerControls } from "@/lib/pinboard/hooks/useScrollerControls";
import { useInfinitePlane } from "@/lib/pinboard/hooks/useInfinitePlane";
import {
  PLANE_W,
  PLANE_H,
  COL_BUFFER,
  ROW_BUFFER,
} from "@/lib/pinboard/constants";
import { useAllContent } from "@/lib/hooks/useAllContent";

// Layout constants
const TILE_W = 220;
const TILE_H = 220;
const GAP_X = 25;
const GAP_Y = 25;
const COLUMN_WIDTH = TILE_W;
const STRIDE_X = COLUMN_WIDTH + GAP_X;

function bucketize<T>(items: T[], columns: number): T[][] {
  const cols: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item));
  return cols;
}

function buildCumY(count: number, step: number) {
  return Array.from({ length: count }, (_, i) => i * step);
}

// Calculate optimal spacing based on number of cards and viewport
function calculateOptimalSpacing(cardCount: number, viewportWidth: number, maxColumns: number) {
  if (cardCount === 0) return { gapX: GAP_X, strideX: STRIDE_X };
  
  // When there are very few cards, reduce spacing significantly
  if (cardCount <= 3) {
    const gapX = Math.max(10, GAP_X / 3);
    return { gapX, strideX: COLUMN_WIDTH + gapX };
  }
  
  // When there are few cards, reduce spacing moderately
  if (cardCount <= maxColumns) {
    const gapX = Math.max(15, GAP_X / 2);
    return { gapX, strideX: COLUMN_WIDTH + gapX };
  }
  
  // Normal spacing for many cards
  return { gapX: GAP_X, strideX: STRIDE_X };
}

export default function BeliefsMasonry({
  q = "",
  cats = [],
}: {
  q?: string;
  cats?: (string | number)[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  const { w: vw, h: vh } = useViewport(scrollerRef);

  const { tiles, hasMore, setSize, isLoading } = useAllContent(q, cats);
  const tilesStableRef = useRef<typeof tiles>([]);
  if (tiles.length) tilesStableRef.current = tiles;
  
  const filteredTiles = tiles;

  // REAL columns based on viewport
  const [realCols, setRealCols] = useState(4);
  useEffect(() => {
    const w = scrollerRef.current?.clientWidth ?? vw;
    if (!w) return;
    // Use optimal spacing for column calculation
    const { gapX: effectiveGapX, strideX: effectiveStrideX } = calculateOptimalSpacing(filteredTiles.length, w, 8);
    const maxCols = Math.max(
      2,
      Math.min(8, Math.floor((w + effectiveGapX) / effectiveStrideX))
    );
    setRealCols(maxCols);
  }, [vw, filteredTiles.length]);

  // OVERRIDE for animation
  const [columns, setColumns] = useState(20); // start with dense grid
  useEffect(() => {
    const timer = setTimeout(() => {
      setColumns(realCols); // transition to real value after 1s
    }, 1000);
    return () => clearTimeout(timer);
  }, [realCols]);

  const { targetRef } = useScrollerControls(scrollerRef);
  const scroll = useScrollState(scrollerRef);
  const { virtualX, virtualY, originX, originY } = useInfinitePlane(
    scrollerRef,
    vw,
    vh,
    scroll,
    targetRef
  );

  const pattern = filteredTiles.length ? filteredTiles : tilesStableRef.current;

  // When there are few items, reduce the number of rendered columns
  const layoutColumns = useMemo(
    () => Math.max(1, Math.min(columns, realCols, pattern.length || 1)),
    [columns, realCols, pattern.length]
  );

  const colBuckets = useMemo(
    () => bucketize(pattern, layoutColumns),
    [pattern, layoutColumns]
  );

  const rowStep = TILE_H + GAP_Y;
  const cumYPerCol = useMemo(
    () => colBuckets.map((col) => buildCumY(col.length, rowStep)),
    [colBuckets, rowStep]
  );
  const patternHPerCol = useMemo(
    () => colBuckets.map((col) => {
      // For seamless repetition, use the actual content height
      // This ensures cards repeat immediately without gaps
      if (col.length > 0) {
        return col.length * rowStep;
      }
      return rowStep;
    }),
    [colBuckets, rowStep]
  );
  const columnOffsets = useMemo(() => {
    const unit = Math.round(TILE_H / 4);
    return Array.from({ length: layoutColumns }, (_, k) => (k % 4) * unit);
  }, [layoutColumns]);

  // Calculate optimal spacing based on number of cards
  const { gapX: effectiveGapX, strideX: effectiveStrideX } = calculateOptimalSpacing(filteredTiles.length, vw, layoutColumns);
  
  const firstCol = Math.floor(virtualX / effectiveStrideX) - COL_BUFFER;
  const visColCount = Math.ceil(vw / effectiveStrideX) + COL_BUFFER * 2;

  const lastAsk = useRef(0);
  useEffect(() => {
    if (!hasMore || isLoading) return;
    const now = Date.now();
    const thresholdY = TILE_H * 20;
    if (virtualY > thresholdY && now - lastAsk.current > 800) {
      lastAsk.current = now;
      setSize((s) => s + 1);
    }
  }, [virtualY, hasMore, isLoading, setSize]);

  // ✅ Delay animation until after HeroTransition
  const [startGridAnim, setStartGridAnim] = useState(false);
  useEffect(() => {
    // Assuming HeroTransition lasts 1.2s
    const t = setTimeout(() => setStartGridAnim(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={scrollerRef} className="fixed inset-0 overflow-auto z-20">
      <motion.div
        ref={planeRef}
        className="relative"
        style={{
          width: PLANE_W,
          height: PLANE_H,
        }}
        initial={{ scale: 0.6 }}
        animate={{ scale: startGridAnim ? 1 : 0.4 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        {Array.from({ length: visColCount }).map((_, i) => {
          const colIndex = firstCol + i;
          const baseCol = ((colIndex % layoutColumns) + layoutColumns) % layoutColumns;
          
          // Use optimal spacing for column positioning
          const x = Math.round(colIndex * effectiveStrideX - originX.current);

          const colCards = colBuckets[baseCol] ?? [];
          const cumY = cumYPerCol[baseCol] ?? [];
          const patternH = patternHPerCol[baseCol] || rowStep;
          const yOffset = columnOffsets[baseCol] || 0;

          const shiftedVirtualY = virtualY - yOffset;
          const firstRepeat = Math.floor(shiftedVirtualY / patternH) - ROW_BUFFER;
          // Ensure we have enough repeats to fill the viewport completely
          // Add extra repeats to prevent any gaps
          const repeatCount = Math.ceil(vh / patternH) + ROW_BUFFER * 2 + 2;

          return (
            <motion.div
              key={`col-${colIndex}`}
              className="absolute top-0"
              style={{ left: x, width: COLUMN_WIDTH }}
              layout
              transition={{ duration: 1 }}
            >
              {Array.from({ length: repeatCount }).flatMap((__, ry) => {
                const rep = firstRepeat + ry;
                const yBase = rep * patternH;
                return colCards.map((card: any, idx: number) => {
                  const y = Math.round(
                    yBase + yOffset + cumY[idx] - originY.current
                  );
                  return (
                    <motion.div
                      key={`tile-${colIndex}-${rep}-${card.id}-${idx}`}
                      className="absolute m-0 p-0 [&>*]:m-0"
                      style={{
                        top: y,
                        width: COLUMN_WIDTH,
                        height: TILE_H,
                        willChange: "transform",
                        transform: "translateZ(0)",
                      }}
                      layout
                      transition={{ duration: 1 }}
                    >
                      <PinterestCard 
                        {...card} 
                        onClick={() => window.location.href = card.route}
                      />
                    </motion.div>
                  );
                });
              })}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
