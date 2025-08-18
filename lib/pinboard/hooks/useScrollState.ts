import { useEffect, useState } from "react";

export function useScrollState(ref: React.RefObject<HTMLElement|null>) {
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScroll({ x: el.scrollLeft, y: el.scrollTop });
          ticking = false;
        });
        ticking = true;
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [ref]);
  return scroll;
}