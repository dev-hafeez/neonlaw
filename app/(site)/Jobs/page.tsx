"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PinterestCard from "@/components/cards/PinterestCard";
import { useViewport } from "@/lib/pinboard/hooks/useViewport";
import { useScrollState } from "@/lib/pinboard/hooks/useScrollState";
import { useScrollerControls } from "@/lib/pinboard/hooks/useScrollerControls";
import { useInfinitePlane } from "@/lib/pinboard/hooks/useInfinitePlane";
import { PLANE_W, PLANE_H, COL_BUFFER, ROW_BUFFER } from "@/lib/pinboard/constants";
import { useWpTiles } from "@/lib/hooks/useWpTiles";
import Navbar from "@/components/nav/Navbar";
import HeroTransition from "@/components/layout/HeroTransition";
import ExitTransition from "@/components/layout/HeroSectionExit";

const TILE_W = 270;
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

export default function About({ q = "Jobs", cats = ["Jobs"] }: { q?: string; cats?: (string | number)[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { w: vw, h: vh } = useViewport(scrollerRef);

  // Real vs animation columns
  const [realCols, setRealCols] = useState(4);
  const [columns, setColumns] = useState(20); // start dense
  const [exitingCardId, setExitingCardId] = useState<string | null>(null);

  useEffect(() => {
    const w = scrollerRef.current?.clientWidth ?? vw;
    if (!w) return;
    const maxCols = Math.max(2, Math.min(8, Math.floor((w + GAP_X) / STRIDE_X)));
    setRealCols(maxCols);
  }, [vw]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setColumns(realCols);
    }, 1000);
    return () => clearTimeout(timer);
  }, [realCols]);

  const { targetRef } = useScrollerControls(scrollerRef);
  const scroll = useScrollState(scrollerRef);
  const { virtualX, virtualY, originX, originY } = useInfinitePlane(scrollerRef, vw, vh, scroll, targetRef);

  const { tiles, hasMore, setSize, isLoading } = useWpTiles(q, cats.join(','));
  const tilesStableRef = useRef<typeof tiles>([]);
  if (tiles.length) tilesStableRef.current = tiles;
  const pattern = tiles.length ? tiles : tilesStableRef.current;

  const colBuckets = useMemo(() => bucketize(pattern, columns), [pattern, columns]);
  const rowStep = TILE_H + GAP_Y;
  const cumYPerCol = useMemo(() => colBuckets.map((col) => buildCumY(col.length, rowStep)), [colBuckets, rowStep]);
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

  const handleNavigate = (id: string) => {
    setExitingCardId(id);
    setTimeout(() => {
      router.push(`/tile/${id}`);
    }, 1000);
  };

  // Delay scaling until after HeroTransition
  const [startGridAnim, setStartGridAnim] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStartGridAnim(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={scrollerRef} className="fixed inset-0 overflow-y-auto overflow-x-hidden z-20">
      <HeroTransition />
      <Navbar />

      <motion.div
        ref={planeRef}
        className="relative"
        style={{ width: PLANE_W, height: PLANE_H }}
        initial={{ scale: 0.6 }}
        animate={{ scale: startGridAnim ? 1 : 0.4 }}
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
          const firstRepeat = Math.floor(shiftedVirtualY / patternH) - ROW_BUFFER;
          const repeatCount = Math.ceil(vh / patternH) + ROW_BUFFER * 2;

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
                  const y = Math.round(yBase + yOffset + cumY[idx] - originY.current);
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

      <ExitTransition />
    </div>
  );
}
