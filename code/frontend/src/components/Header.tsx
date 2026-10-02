import { useEffect, useRef, useState } from "react";
import { T, useList } from "../editable";
import { calm } from "../motion";

/**
 * The floating pill bar, taken from Nothing's product pages: the chrome does
 * not sit on the page, it hovers above it. It drops in at the end of the load
 * sequence and tightens its ground once the hero has passed.
 *
 * Below md the four links fold into a native <details> disclosure — the
 * platform already does open/close state, keyboard and Escape, so there is no
 * menu state in React to get out of step with the page.
 */
export default function Header() {
  const links = useList<{ label: string; href: string }>("nav.links");
  const bar = useRef<HTMLDivElement>(null);
  const [past, setPast] = useState(false);

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-[var(--gutter)] pt-[var(--space-4)]">
      <div
        ref={bar}
        data-load="nav"
        className="mx-auto flex max-w-page items-center justify-between gap-[var(--space-6)] rounded-pill border border-line px-[var(--space-6)] py-[var(--space-3)] backdrop-blur-xl transition-colors"
        style={{
          background: past ? "color-mix(in srgb, var(--surface) 82%, transparent)" : "transparent",
          borderColor: past ? "var(--line)" : "transparent",
          transform: calm ? "none" : undefined,
          transitionDuration: "var(--duration-base)",
        }}
      >
        <T
          k="site.name"
          as="a"
          href="#top"
          className="whitespace-nowrap font-display text-[22px] leading-none tracking-display"
        />

        <nav className="hidden items-center gap-[var(--space-8)] md:flex">
          {links.map((l, i) => (
            <T
              key={i}
              k={`nav.links.${i}.label`}
              as="a"
              href={l.href}
              className="text-label text-ink-soft transition-colors hover:text-ink"
            />
          ))}
        </nav>

        <div className="flex items-center gap-[var(--space-3)]">
          <T
            k="nav.cta.label"
            as="a"
            href="#visit"
            className="hidden whitespace-nowrap rounded-pill border border-accent px-[var(--space-4)] py-[var(--space-2)] text-label text-accent transition-colors hover:bg-accent hover:text-accent-ink sm:inline-block"
          />
          <details className="relative md:hidden">
            <summary className="list-none cursor-pointer rounded-pill border border-line px-[var(--space-4)] py-[var(--space-2)] text-label uppercase text-ink-soft [&::-webkit-details-marker]:hidden">
              <T k="nav.menu.label" as="span" />
            </summary>
            <nav className="absolute right-0 top-[calc(100%+var(--space-3))] w-[56vw] min-w-[180px] rounded border border-line bg-surface p-[var(--space-2)] shadow-md">
              {links.map((l, i) => (
                <T
                  key={i}
                  k={`nav.links.${i}.label`}
                  as="a"
                  href={l.href}
                  className="block rounded-sm px-[var(--space-4)] py-[var(--space-3)] text-label uppercase text-ink"
                />
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
