import { createElement, useSyncExternalStore, type ElementType } from "react";
import initial from "./content.json";

/**
 * The copy on the site, and the owner's hand on it.
 *
 * Every word a visitor reads lives in content.json, addressed by a dot path
 * ("hero.headline", "menu.items.2.name"). Components draw it with <T k="…"/>,
 * which also marks the element so the Studio can find it. When the site runs
 * inside the Studio's frame, a click on marked text tells the Studio which
 * key it is, and the Studio's edits come back here and redraw at once — no
 * rebuild, no agent. The Studio commits the same change to content.json in
 * the repository, so the next build has it too.
 *
 * Colours and type are CSS variables in theme.css; the Studio sets them on
 * :root the same way, live.
 */

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

let store: Json = structuredClone(initial as Json);
const listeners = new Set<() => void>();

function get(path: string): Json | undefined {
  return path.split(".").reduce<Json | undefined>((acc, part) => {
    if (acc === undefined || acc === null || typeof acc !== "object") return undefined;
    return Array.isArray(acc) ? acc[Number(part)] : (acc as { [k: string]: Json })[part];
  }, store);
}

function set(path: string, value: Json) {
  const parts = path.split(".");
  const last = parts.pop()!;
  let cur: Json = store;
  for (const part of parts) {
    if (cur === null || typeof cur !== "object") return;
    const next = Array.isArray(cur) ? cur[Number(part)] : (cur as { [k: string]: Json })[part];
    if (next === undefined || next === null || typeof next !== "object") return;
    cur = next;
  }
  if (cur === null || typeof cur !== "object") return;
  if (Array.isArray(cur)) cur[Number(last)] = value;
  else (cur as { [k: string]: Json })[last] = value;
  store = structuredClone(store);
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** The value at a key, re-rendering when the Studio changes it. */
export function useContent<V extends Json = string>(k: string): V {
  return useSyncExternalStore(subscribe, () => get(k) as V, () => get(k) as V);
}

/** A list at a key, for mapping over items. */
export function useList<V extends Json = { [k: string]: Json }>(k: string): V[] {
  const v = useContent<Json>(k);
  return Array.isArray(v) ? (v as V[]) : [];
}

/**
 * A piece of text, editable in the Studio.
 *
 * `as` picks the element; `k` is the key. Anything else goes on the element.
 */
export function T({ k, as = "span", ...rest }: { k: string; as?: ElementType; className?: string; href?: string }) {
  const value = useContent<Json>(k);
  const text = value === undefined || value === null ? "" : String(value);
  return createElement(as, { ...rest, "data-edit": k }, text);
}

/** The whole store, for a component that needs more than one key. */
export function content(): Json {
  return store;
}

type Msg =
  | { type: "agentteam:set-text"; key: string; value: string }
  | { type: "agentteam:set-theme"; name: string; value: string }
  | { type: "agentteam:hello" };

/** Wires the frame to the Studio. Harmless when the site runs on its own. */
export function installEditor() {
  if (typeof window === "undefined" || window.parent === window) return;
  const parent = window.parent;
  window.addEventListener("message", (e: MessageEvent<Msg>) => {
    const m = e.data;
    if (!m || typeof m !== "object") return;
    if (m.type === "agentteam:set-text") set(m.key, m.value);
    else if (m.type === "agentteam:set-theme") document.documentElement.style.setProperty(m.name, m.value);
    else if (m.type === "agentteam:hello") {
      const theme: Record<string, string> = {};
      const cs = getComputedStyle(document.documentElement);
      for (const name of ["--ground", "--surface", "--ink", "--ink-soft", "--accent", "--accent-ink", "--font-display", "--font-body"]) {
        theme[name] = cs.getPropertyValue(name).trim();
      }
      parent.postMessage({ type: "agentteam:ready", content: store, theme }, "*");
    }
  });
  document.addEventListener("click", (e) => {
    const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-edit]");
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    const r = el.getBoundingClientRect();
    parent.postMessage({ type: "agentteam:pick", key: el.dataset.edit, text: el.textContent ?? "", rect: { x: r.x, y: r.y, w: r.width, h: r.height } }, "*");
  }, true);
  parent.postMessage({ type: "agentteam:ready", content: store, theme: {} }, "*");
}
