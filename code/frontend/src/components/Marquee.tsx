import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { T, useList } from "../editable";
import { gsap, calm } from "../motion";

/**
 * The band of category names that runs across the join between sections —
 * Boc.Studio's pinned marquee strip, set in the display serif instead of a
 * logotype. The row is duplicated so the loop has no seam, and the scroll
 * direction nudges its speed so the band answers the reader.
 */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const words = useList<{ word: string }>("marquee.items");

  useGSAP(
    () => {
      if (calm || words.length === 0) return;
      const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
      const loop = gsap.to(track, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });
      let last = window.scrollY;
      const onScroll = () => {
        const dir = window.scrollY > last ? 1 : -1;
        last = window.scrollY;
        gsap.to(loop, { timeScale: dir * 1.6, duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.3, overwrite: "auto" });
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    { scope: root, dependencies: [words.length] },
  );

  const row = (ariaHidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden || undefined}>
      {words.map((_, i) => (
        <span key={i} className="flex items-center">
          <T
            k={`marquee.items.${i}.word`}
            as="span"
            className="px-[var(--space-8)] font-display text-[clamp(38px,6vw,86px)] leading-none tracking-display"
          />
          <span className="h-[6px] w-[6px] rounded-pill bg-accent" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={root}
      className="relative overflow-hidden border-y border-line bg-surface py-[var(--space-6)]"
    >
      <div data-track className="flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
