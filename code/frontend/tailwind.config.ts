import type { Config } from "tailwindcss";

// Colours and type come from src/theme.css as CSS variables, so the owner can
// change them in the Studio without a rebuild. Tailwind only names them.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "var(--ground)",
        surface: "var(--surface)",
        ink: "var(--ink)",
        "ink-soft": "var(--ink-soft)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
        line: "var(--line)",
        lit: "var(--lit)",
        "lit-ink": "var(--lit-ink)",
        "lit-ink-soft": "var(--lit-ink-soft)",
        "lit-line": "var(--lit-line)",
        "accent-lit": "var(--accent-lit)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "ui-monospace", "monospace"],
      },
      fontSize: {
        label: ["11px", { lineHeight: "1.2", letterSpacing: "var(--tracking-label)" }],
      },
      fontWeight: {
        display: "var(--weight-display)",
        label: "var(--weight-label)",
      },
      letterSpacing: {
        display: "var(--tracking-display)",
        label: "var(--tracking-label)",
      },
      lineHeight: {
        display: "var(--leading-display)",
        body: "var(--leading-body)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "var(--radius-sm)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        glow: "var(--shadow-glow)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      maxWidth: { page: "var(--page)" },
    },
  },
  plugins: [],
} satisfies Config;
