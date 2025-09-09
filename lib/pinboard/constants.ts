// lib/pinboard/constants.ts
export const COLUMN_WIDTH = 300;
export const GAP_Y = 24;
export const STRIDE_X = COLUMN_WIDTH + 24; // GAP_X=24

export const PLANE_W = 10_000_000;
export const PLANE_H = 10_000_000;
export const EDGE_GUARD = 2_000_000;

export const COL_BUFFER = 2;
export const ROW_BUFFER = 2;

// Increase speeds and ease for snappier feel on mobile
export const WHEEL_SPEED = 0.6;      // was 0.4
export const TOUCH_SPEED = 0.9;      // was 0.5
export const CLAMP_MAX_DELTA = 90;   // was 60
export const EASE_K = 0.26;          // was 0.18
export const STOP_EPS = 0.1;

export const DRAG_SPEED = 1.3;       // mouse drag slightly faster
export const HOLD_DELAY_MS = 120;    // quicker auto-scroll hold
export const HOLD_SPEED_PX_S = 1400; // faster auto-scroll

export const clamp = (n: number, max: number) =>
  Math.max(-max, Math.min(max, n));

export const HEIGHT_PX: Record<string, number> = {
  "h-44": 176,
  "h-48": 192,
  // …
};
