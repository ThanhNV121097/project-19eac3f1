import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { T } from "../editable";
import { gsap, ScrollTrigger, calm } from "../motion";

/**
 * The load sequence and the hero.
 *
 * A graphite curtain covers the photograph, then lifts — Boc.Studio's flat
 * colour field, done in the palette's own surface instead of orange. As it
 * goes, the picture settles out of a slight scale, the headline's two lines
 * clip up one after the other, and the pill nav drops in. After that the
 * picture parallaxes under the text and the whole hero dims as the next
 * section arrives over it.
 */
export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]");

      if (calm) {
        gsap.set("[data-curtain]", { display: "none" });
        gsap.set([lines, "[data-fade]", "[data-load='nav']"], { opacity: 1, y: 0 });
        gsap.set("[data-hero-img]", { scale: 1, opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.set(root.current, { visibility: "visible" })
        .fromTo(
          "[data-hero-img]",
          { scale: 1.18, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 2.2 },
          0,
        )
        .to("[data-curtain]", { yPercent: -101, duration: 1.4, ease: "power4.inOut" }, 0.15)
        .fromTo(
          lines,
          { yPercent: 115 },
          { yPercent: 0, duration: 1.25, stagger: 0.09 },
          0.75,
        )
        .fromTo(
          "[data-fade]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
          1.25,
        )
        .fromTo(
          "[data-load='nav']",
          { opacity: 0, y: -28 },
          { opacity: 1, y: 0, duration: 0.9 },
          1.1,
        );

      // The picture drifts up slower than the page; the text leaves first.
      gsap.to("[data-hero-img]", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-copy]", {
        yPercent: -22,
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      ScrollTrigger.refresh();
    },
    { scope: root },
  );

  return (
    <section
      id="top"
      ref={root}
      className="relative h-[100svh] min-h-[620px] w-full overflow-hidden"
      style={{ visibility: calm ? "visible" : "hidden" }}
    >
      {/* The picture is an object under one light, not a wash behind the type:
          a tall frame held to the right half, bleeding off the top edge. */}
      <div className="absolute inset-y-0 right-0 -z-10 w-full overflow-hidden md:w-[52vw]">
        <img
          data-hero-img
          src="/images/hero.jpg"
          alt="A titanium-framed iPhone standing on dark stone under a single rim light"
          className="h-[118%] w-full object-cover object-[center_28%] md:object-center"
        />
        {/* On a phone the picture sits behind the type, so it is veiled from
            the bottom; from md it is beside the type and veiled from the left. */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_srgb,var(--ground)_70%,transparent)_55%,var(--ground)_100%)] md:bg-[linear-gradient(90deg,var(--ground)_0%,color-mix(in_srgb,var(--ground)_30%,transparent)_38%,transparent_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent_0%,var(--ground)_100%)]" />
      </div>

      <div
        data-curtain
        className="absolute inset-0 z-30 bg-ground"
        aria-hidden="true"
      />

      <div
        data-hero-copy
        className="relative mx-auto flex h-full max-w-page flex-col justify-end px-[var(--gutter)] pb-[var(--space-16)]"
      >
        <T
          data-fade
          k="hero.eyebrow"
          as="p"
          className="mb-[var(--space-6)] text-label uppercase text-accent"
        />
        <h1 className="max-w-[12ch] text-[clamp(52px,9vw,138px)]">
          <span className="line-mask">
            <T k="hero.line1" as="span" data-line className="block" />
          </span>
          <span className="line-mask">
            <T k="hero.line2" as="span" data-line className="block italic text-ink-soft" />
          </span>
        </h1>
        <div className="mt-[var(--space-8)] flex max-w-[640px] flex-col gap-[var(--space-6)]">
          <T
            data-fade
            k="hero.sub"
            as="p"
            className="max-w-[54ch] text-[15px] leading-body text-ink-soft"
          />
          <div data-fade className="flex shrink-0 items-center gap-[var(--space-4)]">
            <T
              k="hero.cta.label"
              as="a"
              href="#range"
              className="rounded-pill bg-ink px-[var(--space-6)] py-[var(--space-3)] text-label uppercase text-ground transition-colors duration-200 ease-out hover:bg-accent hover:text-accent-ink"
            />
            <T
              k="hero.secondary.label"
              as="a"
              href="#visit"
              className="rounded-pill border border-line px-[var(--space-6)] py-[var(--space-3)] text-label uppercase text-ink-soft transition-colors duration-200 ease-out hover:border-ink hover:text-ink"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
