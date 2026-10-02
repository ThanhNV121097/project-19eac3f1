import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { T, useList } from "../editable";
import { gsap, calm } from "../motion";

/**
 * What happens at the counter — and the one hard cut on the page. The dark
 * room ends on a straight edge and this section is daylight: the `--lit`
 * ground, dark ink, its own rule colour, no transition at all. That is
 * teenage.engineering's section swap, and it is what the dark half is lit
 * against. The grid's cells arrive one at a time rather than as a row, which
 * is Land-book's stagger.
 */
export default function Service() {
  const root = useRef<HTMLDivElement>(null);
  const items = useList<{ title: string; body: string }>("service.items");

  useGSAP(
    () => {
      if (calm) return;
      gsap.from("[data-line]", {
        yPercent: 115,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from("[data-cell]", {
        opacity: 0,
        y: 34,
        duration: 0.85,
        ease: "expo.out",
        stagger: 0.09,
        scrollTrigger: { trigger: "[data-grid]", start: "top 82%" },
      });
    },
    { scope: root },
  );

  return (
    <section id="service" ref={root} className="relative z-10 bg-lit text-lit-ink">
      <div className="mx-auto max-w-page px-[var(--gutter)] py-[var(--space-32)]">
        <T k="service.eyebrow" as="p" className="text-label uppercase text-accent-lit" />
        <h2 className="mt-[var(--space-8)] max-w-[14ch] text-[clamp(40px,6.4vw,92px)]">
          <span className="line-mask">
            <T k="service.headline" as="span" data-line className="block" />
          </span>
        </h2>
        <T
          k="service.body"
          as="p"
          className="mt-[var(--space-8)] max-w-[58ch] text-[15px] leading-body text-lit-ink-soft"
        />

        <div
          data-grid
          className="mt-[var(--space-24)] grid grid-cols-1 border-t border-lit-line md:grid-cols-2"
        >
          {items.map((_, i) => (
            <div
              key={i}
              data-cell
              className="group border-b border-lit-line py-[var(--space-8)] transition-colors duration-200 ease-out md:px-[var(--space-8)] md:odd:pl-0 md:even:border-l"
            >
              <div className="flex items-start justify-between gap-[var(--space-6)]">
                <T
                  k={`service.items.${i}.title`}
                  as="h3"
                  className="font-display text-[clamp(26px,3vw,40px)] leading-tight transition-colors duration-200 ease-out group-hover:text-accent-lit"
                />
                <span
                  aria-hidden="true"
                  className="mt-[var(--space-2)] h-[7px] w-[7px] shrink-0 rounded-pill bg-lit-line transition-colors duration-200 ease-out group-hover:bg-accent-lit"
                />
              </div>
              <T
                k={`service.items.${i}.body`}
                as="p"
                className="mt-[var(--space-4)] max-w-[46ch] text-[14px] leading-body text-lit-ink-soft"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
