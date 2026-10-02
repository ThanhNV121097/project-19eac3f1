import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { T, useList } from "../editable";
import { gsap, calm } from "../motion";

type Column = { title: string; links: { label: string; href: string }[] };

/**
 * The close: an invitation set at the page's largest size, then the footer.
 * The headline's words rise one by one and the footer columns fade in under
 * them, so the page ends on the same beat it opened with.
 */
export default function Visit() {
  const root = useRef<HTMLDivElement>(null);
  const columns = useList<Column>("footer.columns");

  useGSAP(
    () => {
      if (calm) return;
      gsap.from("[data-line]", {
        yPercent: 115,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.from("[data-reveal]", {
        opacity: 0,
        y: 22,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative z-10 bg-ground">
      <section id="visit" className="mx-auto max-w-page px-[var(--gutter)] pb-[var(--space-24)] pt-[var(--space-32)]">
        <T k="visit.eyebrow" as="p" data-reveal className="text-label uppercase text-accent" />
        <h2 className="mt-[var(--space-8)] text-[clamp(48px,9vw,140px)]">
          <span className="line-mask">
            <T k="visit.headline" as="span" data-line className="block" />
          </span>
        </h2>
        <div className="mt-[var(--space-12)] flex flex-col gap-[var(--space-8)] md:flex-row md:items-end md:justify-between">
          <T
            k="visit.body"
            as="p"
            data-reveal
            className="max-w-[56ch] text-[15px] leading-body text-ink-soft"
          />
          <T
            k="visit.cta.label"
            as="a"
            href="#top"
            data-reveal
            className="shrink-0 rounded-pill bg-accent px-[var(--space-8)] py-[var(--space-4)] text-label uppercase text-accent-ink transition-opacity duration-200 ease-out hover:opacity-80"
          />
        </div>
        <T
          k="visit.note"
          as="p"
          data-reveal
          className="mt-[var(--space-12)] max-w-[60ch] text-[12px] leading-body text-ink-soft"
        />
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-page px-[var(--gutter)] py-[var(--space-16)]">
          <div className="grid grid-cols-1 gap-[var(--space-12)] md:grid-cols-12">
            <div className="md:col-span-5">
              <T k="site.name" as="p" className="font-display text-[32px] tracking-display" />
              <T k="footer.line" as="p" className="mt-[var(--space-2)] text-[13px] text-ink-soft" />
            </div>
            {columns.map((c, i) => (
              <nav key={i} className="md:col-span-2 md:col-start-auto">
                <T
                  k={`footer.columns.${i}.title`}
                  as="p"
                  className="text-label uppercase text-ink-soft"
                />
                <ul className="mt-[var(--space-4)] space-y-[var(--space-2)]">
                  {c.links.map((l, j) => (
                    <li key={j}>
                      <T
                        k={`footer.columns.${i}.links.${j}.label`}
                        as="a"
                        href={l.href}
                        className="text-[13px] text-ink transition-colors duration-200 ease-out hover:text-accent"
                      />
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
          <T
            k="footer.colophon"
            as="p"
            className="mt-[var(--space-16)] border-t border-line pt-[var(--space-6)] text-[11px] text-ink-soft"
          />
        </div>
      </footer>
    </div>
  );
}
