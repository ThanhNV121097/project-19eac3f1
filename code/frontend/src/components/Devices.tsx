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

/** The stack is not one row five times. Each device gets the layout its object
 *  wants: the phone beside its specs, the Mac filling the screen, the iPad
 *  mirrored, the watch floating in the room with no edge at all. */
type Variant = "split" | "bleed" | "mirror" | "float";
const VARIANTS: Variant[] = ["split", "bleed", "mirror", "float", "bleed"];

/**
 * The stack: each device holds the whole screen alone, then the next slides up
 * over it — teenage.engineering's one-object-under-one-light, choreographed as
 * a sticky stack. Panels pin with CSS position:sticky, which survives a resize
 * and costs nothing; GSAP handles only the reveal — Awwwards' frame drawn
 * first, the picture rising into it — and the panel underneath dimming as it
 * is covered.
 */
export default function Devices() {
  const root = useRef<HTMLDivElement>(null);
  const items = useList<Device>("devices.items");

  useGSAP(
    () => {
      if (calm || items.length === 0) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");

      panels.forEach((panel, i) => {
        const frame = panel.querySelector<HTMLElement>("[data-frame]");
        const img = panel.querySelector<HTMLElement>("[data-pic]")!;
        const wrap = panel.querySelector<HTMLElement>("[data-pic-wrap]")!;

        // The frame is drawn, then the picture rises into it and settles.
        const reveal = gsap.timeline({
          scrollTrigger: { trigger: panel, start: "top 72%" },
        });
        if (frame) {
          reveal.fromTo(
            frame,
            { scaleY: 0, transformOrigin: "top center" },
            { scaleY: 1, duration: 0.7, ease: "expo.inOut" },
          );
        }
        reveal.fromTo(
          img,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.16 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2, ease: "expo.out" },
          frame ? "-=0.12" : 0,
        );

        // Then it drifts, slower than the panel it sits in.
        gsap.fromTo(
          wrap,
          { yPercent: 5 },
          {
            yPercent: -5,
            ease: "none",
            scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: true },
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

        // Only the pinned layout stacks, so only it dims as the next covers it.
        if (i < panels.length - 1) {
          gsap.matchMedia().add("(min-width: 768px)", () => {
            gsap.to(panel.querySelector("[data-inner]"), {
              scale: 0.94,
              opacity: 0.25,
              ease: "none",
              scrollTrigger: { trigger: panels[i + 1], start: "top bottom", end: "top top", scrub: true },
            });
          });
        }
      });
    },
    { scope: root, dependencies: [items.length] },
  );

  return (
    <section id="devices" ref={root} className="relative">
      {items.map((d, i) => {
        const v = VARIANTS[i % VARIANTS.length];
        const bleed = v === "bleed";
        const float = v === "float";
        const mirror = v === "mirror";

        return (
          <article
            key={i}
            data-panel
            className="relative w-full overflow-hidden bg-ground py-[var(--space-16)] md:sticky md:top-0 md:h-[100svh] md:min-h-[640px] md:py-0"
          >
            {/* The bleed panel's picture is the panel: the object fills the
                screen and the words sit in its shadow. */}
            {bleed && (
              <div data-pic-wrap className="absolute inset-0 z-0">
                <img
                  data-pic
                  src={d.image}
                  alt={d.alt}
                  loading="lazy"
                  className="h-full w-full scale-110 object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--ground)_72%,transparent)_0%,color-mix(in_srgb,var(--ground)_28%,transparent)_45%,var(--ground)_100%)] md:bg-[linear-gradient(74deg,var(--ground)_6%,color-mix(in_srgb,var(--ground)_72%,transparent)_38%,transparent_86%)]" />
              </div>
            )}

            <div
              data-inner
              className={[
                "relative z-10 mx-auto grid max-w-page grid-cols-1 items-center gap-[var(--space-8)] px-[var(--gutter)] md:h-full",
                bleed ? "md:grid-cols-12" : "md:grid-cols-12",
              ].join(" ")}
            >
              <div
                className={[
                  "order-2 md:order-none",
                  bleed && "md:col-span-6 md:col-start-1 md:self-end md:pb-[var(--space-24)]",
                  float && "md:col-span-4 md:col-start-1",
                  mirror && "md:col-span-4 md:col-start-9",
                  v === "split" && "md:col-span-5 md:col-start-1",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
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
                  className={
                    bleed
                      ? "mt-[var(--space-6)] text-[clamp(52px,9vw,128px)]"
                      : "mt-[var(--space-6)] text-[clamp(44px,6.5vw,96px)]"
                  }
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
                {/* On the bleed panel the specs run as one line so the picture
                    keeps the screen; elsewhere they are a table. */}
                {bleed ? (
                  <ul data-step className="mt-[var(--space-8)] flex flex-wrap gap-[var(--space-6)]">
                    {d.specs.map((_, s) => (
                      <li key={s} className="border-l border-line pl-[var(--space-4)]">
                        <T
                          k={`devices.items.${i}.specs.${s}.k`}
                          as="p"
                          className="text-label uppercase text-ink-soft"
                        />
                        <T
                          k={`devices.items.${i}.specs.${s}.v`}
                          as="p"
                          className="mt-[var(--space-1)] text-[13px] text-ink"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <dl data-step className="mt-[var(--space-8)] border-t border-line">
                    {d.specs.map((_, s) => (
                      <div
                        key={s}
                        className="flex items-center justify-between border-b border-line py-[var(--space-3)]"
                      >
                        <T
                          k={`devices.items.${i}.specs.${s}.k`}
                          as="dt"
                          className="text-label uppercase text-ink-soft"
                        />
                        <T k={`devices.items.${i}.specs.${s}.v`} as="dd" className="text-[13px] text-ink" />
                      </div>
                    ))}
                  </dl>
                )}
              </div>

              {/* The split panel keeps its drawn frame. The mirror panel puts
                  it on the other side. The float panel has no edge at all:
                  the object is masked into the room. */}
              {!bleed && (
                <div
                  className={[
                    "order-1 md:order-none",
                    float && "md:col-span-7 md:col-start-6",
                    mirror && "md:col-span-7 md:col-start-1 md:row-start-1",
                    v === "split" && "md:col-span-6 md:col-start-7",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <div
                    data-pic-wrap
                    className={
                      float
                        ? "relative h-[38svh] md:h-[76svh]"
                        : "relative h-[34svh] md:h-[72svh]"
                    }
                  >
                    {!float && (
                      <div
                        data-frame
                        className="absolute inset-0 border border-line bg-surface"
                        aria-hidden="true"
                      />
                    )}
                    <img
                      data-pic
                      src={d.image}
                      alt={d.alt}
                      loading="lazy"
                      className={
                        float
                          ? "absolute inset-0 h-full w-full object-contain [mask-image:radial-gradient(70%_70%_at_50%_50%,#000_52%,transparent_100%)]"
                          : "absolute inset-0 h-full w-full object-cover"
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}
