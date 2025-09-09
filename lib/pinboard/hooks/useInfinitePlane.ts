import { useEffect, useLayoutEffect, useRef } from "react";
import { EDGE_GUARD, PLANE_H, PLANE_W } from "@/lib/pinboard/constants";

export function useInfinitePlane(
  scrollerRef: React.RefObject<HTMLDivElement|null>,
  vw: number,
  vh: number,
  scroll: {x:number,y:number},
  targetRef: React.RefObject<{x:number,y:number}>
) {
  const originX = useRef(0);
  const originY = useRef(0);
  const recentering = useRef(false);

  // center on mount
  useLayoutEffect(() => {
    const s = scrollerRef.current;
    if (!s) return;
    const cx = (PLANE_W - s.clientWidth) / 2;
    const cy = (PLANE_H - s.clientHeight) / 2;
    s.scrollLeft = cx; s.scrollTop = cy;
    originX.current = -cx; originY.current = -cy;
    targetRef.current = { x: cx, y: cy };
  }, []);

  // invisible recenter
  useLayoutEffect(() => {
    const s = scrollerRef.current;
    if (!s || recentering.current) return;
    const sl = s.scrollLeft, st = s.scrollTop;
    const leftEdge = EDGE_GUARD, rightEdge = PLANE_W - vw - EDGE_GUARD;
    const topEdge = EDGE_GUARD, bottomEdge = PLANE_H - vh - EDGE_GUARD;
    const cx = (PLANE_W - vw) / 2, cy = (PLANE_H - vh) / 2;

    let dx = 0, dy = 0, need = false;
    if (sl < leftEdge || sl > rightEdge) { dx = sl - cx; need = true; }
    if (st < topEdge || st > bottomEdge) { dy = st - cy; need = true; }
    if (!need) return;

    recentering.current = true;
    originX.current += dx; originY.current += dy;
    s.scrollLeft = cx; s.scrollTop = cy;
    targetRef.current.x = cx; targetRef.current.y = cy;
    requestAnimationFrame(() => { recentering.current = false; });
  }, [scroll.x, scroll.y, vw, vh]);

  const virtualX = originX.current + scroll.x;
  const virtualY = originY.current + scroll.y;
  return { virtualX, virtualY, originX, originY };
}