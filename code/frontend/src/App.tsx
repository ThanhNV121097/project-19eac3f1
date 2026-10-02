import { T, useList, useContent } from "./editable";

/**
 * The shell the design replaces.
 *
 * This file is a placeholder so the scaffold builds and runs before the
 * design exists. The team rewrites it and adds components under
 * src/components/; what must stay is the rule every component follows: the
 * words come from content.json through <T/>, the colours from theme.css.
 */
export default function App() {
  const links = useList<{ label: string; href: string }>("nav.links");
  const name = useContent("site.name");
  return (
    <div className="min-h-screen bg-ground text-ink font-body">
      <header className="mx-auto max-w-page px-[var(--gutter)] py-6 flex items-center justify-between">
        <T k="site.name" as="a" href="/" className="font-display text-lg" />
        <nav className="flex gap-6 text-sm">
          {links.map((l, i) => <T key={i} k={`nav.links.${i}.label`} as="a" href={l.href} />)}
          <T k="nav.cta.label" as="a" href="#contact" className="rounded bg-accent px-4 py-2 text-accent-ink" />
        </nav>
      </header>
      <main className="mx-auto max-w-page px-[var(--gutter)] py-24">
        <T k="hero.headline" as="h1" className="text-[clamp(44px,7vw,104px)] max-w-[14ch]" />
        <T k="hero.sub" as="p" className="mt-6 text-xl text-ink-soft max-w-[48ch]" />
        <T k="hero.cta.label" as="a" href="#contact" className="mt-10 inline-block rounded bg-accent px-6 py-3 text-accent-ink" />
      </main>
      <footer className="mx-auto max-w-page px-[var(--gutter)] py-12 text-sm text-ink-soft border-t border-line">
        <T k="footer.line" /> · {name}
      </footer>
    </div>
  );
}
