import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { T, useList } from "../editable";
import { gsap, calm } from "../motion";

/**
 * The statement that follows the hero: one headline, one paragraph, and three
 * counted facts whose rules draw themselves left to right as they arrive —
 * Awwwards' frame-before-content reveal, applied to a rule instead of a photo.
 */
export default function Range() {
  const root = useRef<HTMLDivElement>(null);
  const stats = useList<{ value: string; label: string }>("range.stats");

  useGSAP(
    () => {
      if (calm) return;
      const trigger = { trigger: root.current, start: "top 72%" };

      gsap.from("[data-line] ", {
        yPercent: 115,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 26,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });
      gsap.from("[data-rule]", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: trigger,
      });
    },
    { scope: root },
  );

  return (
    <section
      id="range"
      ref={root}
      className="mx-auto max-w-page px-[var(--gutter)] py-[var(--space-32)]"
    >
      <T k="range.eyebrow" as="p" data-reveal className="text-label uppercase text-accent" />
      <h2 className="mt-[var(--space-8)] max-w-[16ch] text-[clamp(40px,6.4vw,92px)]">
        <span className="line-mask">
          <T k="range.headline" as="span" data-line className="block" />
        </span>
      </h2>
      <T
        k="range.body"
        as="p"
        data-reveal
        className="mt-[var(--space-12)] max-w-[62ch] text-[15px] leading-body text-ink-soft"
      />

      <dl className="mt-[var(--space-24)] grid grid-cols-1 gap-[var(--space-8)] md:grid-cols-3">
        {stats.map((_, i) => (
          <div key={i}>
            <div data-rule className="h-px w-full bg-line" />
            <T
              k={`range.stats.${i}.value`}
              as="dd"
              data-reveal
              className="mt-[var(--space-6)] font-display text-[clamp(44px,5vw,72px)] leading-none tracking-display"
            />
            <T
              k={`range.stats.${i}.label`}
              as="dt"
              data-reveal
              className="mt-[var(--space-3)] text-label uppercase text-ink-soft"
            />
          </div>
        ))}
      </dl>
    </section>
  );
}
