"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import PinterestCard from "@/components/pinterest-card";
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
// ⬇️ swapped: use People tiles (same return shape as your old hook)
import { usePeopleTiles } from "@/lib/usePeopleTiles";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import HeroTransition from "@/components/HeroTransition";
import HeroSectionExit from "@/components/HeroSectionExit";

const TILE_W = 270;
const TILE_H = 220;
const GAP_X = 25;
const GAP_Y = 25;
const COLUMN_WIDTH = TILE_W;
const STRIDE_X = COLUMN_WIDTH + GAP_X;

// 🔹 Helper functions
function bucketize<T>(items: T[], columns: number): T[][] {
  const cols: T[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, i) => cols[i % columns].push(item));
  return cols;
}

function buildCumY(count: number, step: number) {
  return Array.from({ length: count }, (_, i) => i * step);
}

export default function People() {
  const searchParams = useSearchParams();
  const q = searchParams?.get('q') || ""; // Don't filter by search term
  const cats: (string | number)[] = searchParams?.get('cat') ? [searchParams.get('cat')!] : []; // Filter by category if provided
  
  // Create a stable key based on search params to avoid unnecessary re-renders
  const searchKey = useMemo(() => {
    return `${q}-${cats.join(',')}`;
  }, [q, cats]);
  
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);

  const { w: vw, h: vh } = useViewport(scrollerRef);

  // Real vs animation columns
  const [realCols, setRealCols] = useState(4);
  const [columns, setColumns] = useState(20); // start dense
  const [exitingCardId, setExitingCardId] = useState<string | null>(null);

  // Responsive columns
  useEffect(() => {
    const w = scrollerRef.current?.clientWidth ?? vw;
    if (!w) return;
    const maxCols = Math.max(
      2,
      Math.min(8, Math.floor((w + GAP_X) / STRIDE_X))
    );
    setRealCols(maxCols);
  }, [vw]);

  // Smooth transition to real grid after Hero
  useEffect(() => {
    const timer = setTimeout(() => {
      setColumns(realCols);
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

  // ✅ Fetch tiles (now from People)
  const { tiles, hasMore, setSize, isLoading } = usePeopleTiles(q, cats, searchKey);
  const tilesStableRef = useRef<typeof tiles>([]);
  if (tiles.length) tilesStableRef.current = tiles;
  const pattern = tiles.length ? tiles : tilesStableRef.current;

  // ✅ Layout calc
  const colBuckets = useMemo(
    () => bucketize(pattern, columns),
    [pattern, columns]
  );
  const rowStep = TILE_H + GAP_Y;
  const cumYPerCol = useMemo(
    () => colBuckets.map((col) => buildCumY(col.length, rowStep)),
    [colBuckets, rowStep]
  );
  const patternHPerCol = useMemo(
    () => colBuckets.map((col) => Math.max(rowStep, col.length * rowStep)),
    [colBuckets, rowStep]
  );
  const columnOffsets = useMemo(() => {
    const unit = Math.round(TILE_H / 3);
    return Array.from({ length: columns }, (_, k) => (k % 3) * unit);
  }, [columns]);

  const firstCol = Math.floor(virtualX / STRIDE_X) - COL_BUFFER;
  const visColCount = Math.ceil(vw / STRIDE_X) + COL_BUFFER * 2;

  // ✅ Infinite loading trigger
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

  // ✅ Handle click navigation animation
  const handleNavigate = (id: string) => {
    setExitingCardId(id);
    setTimeout(() => {
      // Navigate to the people detail page
      router.push(`/people/${id}`);
    }, 1000);
  };

  // ✅ Start grid animation after Hero
  const [startGridAnim, setStartGridAnim] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStartGridAnim(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Debug info
  console.log('People page loaded:', { tiles: tiles.length, hasMore, isLoading });

  return (
    <div
      ref={scrollerRef}
      className="fixed inset-0 overflow-y-auto overflow-x-hidden z-20"
    >
      <HeroTransition />
      <Navbar />
      <Footer />

      <motion.div
        ref={planeRef}
        className="relative"
        style={{ width: PLANE_W, height: PLANE_H }}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{
          scale: startGridAnim ? 1 : 0.4,
          opacity: startGridAnim ? 1 : 0,
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        {Array.from({ length: visColCount }).map((_, i) => {
          const colIndex = firstCol + i;
          const baseCol = ((colIndex % columns) + columns) % columns;
          const x = Math.round(colIndex * STRIDE_X - originX.current);

          const colCards = colBuckets[baseCol] ?? [];
          const cumY = cumYPerCol[baseCol] ?? [];
          const patternH = patternHPerCol[baseCol] || rowStep;
          const yOffset = columnOffsets[baseCol] || 0;

          const shiftedVirtualY = virtualY - yOffset;
          const firstRepeat =
            Math.floor(shiftedVirtualY / patternH) - ROW_BUFFER;
          const repeatCount =
            Math.ceil(vh / patternH) + ROW_BUFFER * 2;

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
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      layout
                    >
                      <PinterestCard
                        {...card}
                        isExiting={exitingCardId === card.id}
                        onClick={() => handleNavigate(card.id)}
                      />
                    </motion.div>
                  );
                });
              })}
            </motion.div>
          );
        })}
      </motion.div>

      <HeroSectionExit />
    </div>
  );
}
