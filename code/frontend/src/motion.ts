import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/** True when the visitor asked for less movement. Read once, at module load. */
export const calm =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in step. */
export function useSmoothScroll() {
  useEffect(() => {
    if (calm) return;
    const lenis = new Lenis({ duration: 1.1, lerp: 0.1 });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

export { gsap, ScrollTrigger };
