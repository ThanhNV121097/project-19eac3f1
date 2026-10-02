import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { T, useList } from "../editable";
import { gsap, calm } from "../motion";

type Device = {
  index: string;
  name: string;
  line: string;
  body: string;
  specs: { k: string; v: string }[];
  image: string;
  alt: string;
};

/**
 * The stack: each device holds the whole screen alone, then the next slides up
 * over it — teenage.engineering's one-object-under-one-light, choreographed as
 * a sticky stack. Panels pin with CSS position:sticky, which survives a resize
 * and costs nothing; GSAP handles only what is scrubbed — the picture scaling
 * down inside its frame and the panel underneath dimming as it is covered.
 */
export default function Devices() {
  const root = useRef<HTMLDivElement>(null);
  const items = useList<Device>("devices.items");

  useGSAP(
    () => {
      if (calm || items.length === 0) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");

      panels.forEach((panel, i) => {
        const img = panel.querySelector<HTMLElement>("[data-pic]")!;

        // The picture resolves inside its frame as the panel arrives.
        gsap.fromTo(
          img,
          { scale: 1.22, yPercent: 6 },
          {
            scale: 1,
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "top top", scrub: true },
          },
        );

        // The copy rises once, when the panel settles.
        gsap.from(panel.querySelectorAll("[data-step]"), {
          opacity: 0,
          y: 30,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: panel, start: "top 60%" },
        });

        // Everything but the last panel dims and recedes as the next covers it.
        if (i < panels.length - 1) {
          gsap.to(panel.querySelector("[data-inner]"), {
            scale: 0.94,
            opacity: 0.25,
            ease: "none",
            scrollTrigger: { trigger: panels[i + 1], start: "top bottom", end: "top top", scrub: true },
          });
        }
      });
    },
    { scope: root, dependencies: [items.length] },
  );

  return (
    <section id="devices" ref={root} className="relative">
      <div className="mx-auto max-w-page px-[var(--gutter)] pb-[var(--space-12)] pt-[var(--space-24)]">
        <T k="devices.eyebrow" as="p" className="text-label uppercase text-accent" />
      </div>

      {items.map((d, i) => (
        <article
          key={i}
          data-panel
          className="relative w-full bg-ground py-[var(--space-16)] md:sticky md:top-0 md:h-[100svh] md:min-h-[640px] md:py-0"
        >
          <div
            data-inner
            className="mx-auto grid max-w-page grid-cols-1 items-center gap-[var(--space-8)] px-[var(--gutter)] md:h-full md:grid-cols-12"
          >
            <div className="order-2 md:order-1 md:col-span-5">
              <div className="flex items-baseline gap-[var(--space-4)]">
                <T
                  k={`devices.items.${i}.index`}
                  as="span"
                  data-step
                  className="text-label uppercase text-accent"
                />
                <div className="h-px flex-1 bg-line" aria-hidden="true" />
              </div>
              <T
                k={`devices.items.${i}.name`}
                as="h3"
                data-step
                className="mt-[var(--space-6)] text-[clamp(44px,6.5vw,96px)]"
              />
              <T
                k={`devices.items.${i}.line`}
                as="p"
                data-step
                className="mt-[var(--space-4)] max-w-[30ch] font-display text-[clamp(20px,2vw,28px)] italic leading-tight text-ink-soft"
              />
              <T
                k={`devices.items.${i}.body`}
                as="p"
                data-step
                className="mt-[var(--space-6)] hidden max-w-[52ch] text-[14px] leading-body text-ink-soft md:block"
              />
              <dl data-step className="mt-[var(--space-8)] border-t border-line">
                {d.specs.map((_, s) => (
                  <div key={s} className="flex items-center justify-between border-b border-line py-[var(--space-3)]">
                    <T
                      k={`devices.items.${i}.specs.${s}.k`}
                      as="dt"
                      className="text-label uppercase text-ink-soft"
                    />
                    <T
                      k={`devices.items.${i}.specs.${s}.v`}
                      as="dd"
                      className="text-[13px] text-ink"
                    />
                  </div>
                ))}
              </dl>
            </div>

            <div className="order-1 md:order-2 md:col-span-6 md:col-start-7">
              <div className="relative h-[34svh] overflow-hidden rounded bg-surface md:h-[72svh]">
                <img
                  data-pic
                  src={d.image}
                  alt={d.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
