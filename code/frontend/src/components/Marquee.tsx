import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { T, useList } from "../editable";
import { gsap, calm } from "../motion";

/** How many identical rows make the seamless loop. The track travels exactly
 *  one row's width, so adding a third row needs no new number anywhere else. */
const ROWS = 2;

/**
 * The band of category names, pinned across the viewport while the section
 * under it keeps scrolling — Boc.Studio's strip, set in the display serif
 * instead of a logotype. The band sticks at the top of the window from the
 * moment it arrives until the range section has nearly left, so the words run
 * sideways while the page runs up behind them. The scroll direction nudges the
 * loop's speed, so the band answers the reader.
 */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const words = useList<{ word: string }>("marquee.items");

  useGSAP(
    () => {
      if (calm || words.length === 0) return;
      const band = root.current!.querySelector<HTMLElement>("[data-band]")!;
      const track = root.current!.querySelector<HTMLElement>("[data-track]")!;

      const loop = gsap.to(track, {
        xPercent: -100 / ROWS,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      // The band is pinned by CSS position:sticky inside the range block, so
      // it holds the top of the window while that section scrolls under it and
      // lets go on its own at the bottom. GSAP only dims it as it is passed,
      // so it reads as a layer over the page rather than a second header.
      gsap.to(band, {
        opacity: 0.5,
        ease: "none",
        scrollTrigger: { trigger: "#range", start: "top top", end: "bottom 70%", scrub: true },
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
    <div ref={root} className="relative z-20">
      <div
        data-band
        className="relative overflow-hidden border-y border-line bg-surface py-[var(--space-6)]"
      >
        <div data-track className="flex w-max">
          {Array.from({ length: ROWS }, (_, r) => (
            <div key={r} className="flex shrink-0">
              {row(r > 0)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
