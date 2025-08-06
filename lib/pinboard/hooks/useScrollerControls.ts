import { useEffect, useRef } from "react";
import {
  WHEEL_SPEED, TOUCH_SPEED, CLAMP_MAX_DELTA, EASE_K, STOP_EPS,
  DRAG_SPEED, HOLD_DELAY_MS, HOLD_SPEED_PX_S, clamp
} from "@/lib/pinboard/constants";

export function useScrollerControls(ref: React.RefObject<HTMLDivElement|null>) {
  const targetRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    const s = ref.current;
    if (!s) return;

    const step = () => {
      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      const nx = s.scrollLeft + (tx - s.scrollLeft) * EASE_K;
      const ny = s.scrollTop + (ty - s.scrollTop) * EASE_K;
      const closeX = Math.abs(tx - s.scrollLeft) < STOP_EPS;
      const closeY = Math.abs(ty - s.scrollTop) < STOP_EPS;
      s.scrollLeft = closeX ? tx : nx;
      s.scrollTop = closeY ? ty : ny;
      if (!closeX || !closeY) rafRef.current = requestAnimationFrame(step);
      else rafRef.current = 0;
    };
    const ensureRAF = () => { if (!rafRef.current) rafRef.current = requestAnimationFrame(step); };

    // wheel
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return;
      e.preventDefault();
      let { deltaX: dx, deltaY: dy, deltaMode } = e;
      if (deltaMode === 1) { const LINE = 16; dx *= LINE; dy *= LINE; }
      else if (deltaMode === 2) { const PAGE = s.clientHeight; dx *= PAGE; dy *= PAGE; }
      targetRef.current.x += clamp(dx * WHEEL_SPEED, CLAMP_MAX_DELTA);
      targetRef.current.y += clamp(dy * WHEEL_SPEED, CLAMP_MAX_DELTA);
      ensureRAF();
    };

    // touch
    let active = false, lastX = 0, lastY = 0;
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      active = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      targetRef.current.x = s.scrollLeft;
      targetRef.current.y = s.scrollTop;
    };
    const onMove = (e: TouchEvent) => {
      if (!active || e.touches.length !== 1) return;
      e.preventDefault();
      const x = e.touches[0].clientX, y = e.touches[0].clientY;
      targetRef.current.x += clamp((lastX - x) * TOUCH_SPEED, CLAMP_MAX_DELTA);
      targetRef.current.y += clamp((lastY - y) * TOUCH_SPEED, CLAMP_MAX_DELTA);
      lastX = x; lastY = y; ensureRAF();
    };
    const onEnd = () => { active = false; };

    // keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      const h = s.clientHeight, w = s.clientWidth;
      let dx = 0, dy = 0, used = true;
      switch (e.key) {
        case "ArrowDown": dy = h * 0.15; break;
        case "ArrowUp":   dy = -h * 0.15; break;
        case "PageDown":  dy = h * 0.7; break;
        case "PageUp":    dy = -h * 0.7; break;
        case "ArrowRight": dx = w * 0.15; break;
        case "ArrowLeft":  dx = -w * 0.15; break;
        case "Home":      targetRef.current.y = 0; break;
        case "End":       targetRef.current.y = 1e7; break; // plane size will clamp visually
        default: used = false;
      }
      if (used) { e.preventDefault(); targetRef.current.x += dx; targetRef.current.y += dy; ensureRAF(); }
    };

    // pointer drag + hold
    let dragging = false;
    let startX = 0, startY = 0;
    let startTargetX = 0, startTargetY = 0;
    let holdTimer: number | undefined;
    let autoRAF: number | undefined;
    let prevTs: number | undefined;
    let autoDirY: 1 | -1 = 1;

    const clearHold = () => { if (holdTimer !== undefined) window.clearTimeout(holdTimer); holdTimer = undefined; };
    const stopAuto = () => { if (autoRAF !== undefined) cancelAnimationFrame(autoRAF); autoRAF = undefined; prevTs = undefined; };
    const startAuto = (dir: 1 | -1) => {
      stopAuto(); autoDirY = dir;
      const tick = (ts: number) => {
        if (!dragging) return stopAuto();
        if (prevTs === undefined) prevTs = ts;
        const dt = (ts - prevTs) / 1000; prevTs = ts;
        targetRef.current.y += autoDirY * HOLD_SPEED_PX_S * dt;
        ensureRAF();
        autoRAF = requestAnimationFrame(tick);
      };
      autoRAF = requestAnimationFrame(tick);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType !== "mouse") return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startTargetX = s.scrollLeft; startTargetY = s.scrollTop;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "grabbing";
      clearHold();
      holdTimer = window.setTimeout(() => {
        const rect = s.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        startAuto(e.clientY < centerY ? -1 : 1);
      }, HOLD_DELAY_MS);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      clearHold(); stopAuto();
      e.preventDefault();
      const dx = (e.clientX - startX) * DRAG_SPEED;
      const dy = (e.clientY - startY) * DRAG_SPEED;
      targetRef.current.x = startTargetX - dx;
      targetRef.current.y = startTargetY - dy;
      ensureRAF();
    };

    const endPointer = () => {
      if (!dragging) return;
      dragging = false;
      clearHold(); stopAuto();
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    // listeners
    s.addEventListener("wheel", onWheel, { passive: false, capture: true });
    s.addEventListener("touchstart", onStart, { passive: false });
    s.addEventListener("touchmove", onMove, { passive: false });
    s.addEventListener("touchend", onEnd);
    s.addEventListener("touchcancel", onEnd);
    document.addEventListener("keydown", onKeyDown, { passive: false, capture: true });

    s.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: false });
    document.addEventListener("pointerup", endPointer, { passive: true });
    document.addEventListener("pointercancel", endPointer, { passive: true });
    document.addEventListener("mouseleave", endPointer, { passive: true });

    return () => {
      s.removeEventListener("wheel", onWheel as any, { capture: true } as any);
      s.removeEventListener("touchstart", onStart as any);
      s.removeEventListener("touchmove", onMove as any);
      s.removeEventListener("touchend", onEnd as any);
      s.removeEventListener("touchcancel", onEnd as any);
      document.removeEventListener("keydown", onKeyDown as any, { capture: true } as any);
      s.removeEventListener("pointerdown", onPointerDown as any);
      document.removeEventListener("pointermove", onPointerMove as any);
      document.removeEventListener("pointerup", endPointer as any);
      document.removeEventListener("pointercancel", endPointer as any);
      document.removeEventListener("mouseleave", endPointer as any);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [ref]);

  return { targetRef };
}