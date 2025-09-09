import { useEffect, useState } from "react";

export function useViewport<T extends HTMLElement>(ref: React.RefObject<T|null>) {
  const [size, setSize] = useState({ w: 1200, h: 800 });
  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (!el) return;
      setSize({ w: el.clientWidth, h: el.clientHeight });
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [ref]);
  return size;
}