"use client";

import { useSyncExternalStore } from "react";
import { subscribe as onFrame } from "./scroll";

/**
 * Which colour theme sits under the header, and which section is "current"
 * for the rail. Computed once per frame, exposed as an external store so any
 * number of components can read it without re-measuring.
 */
export interface Active {
  theme: string;
  section: string;
}

const listeners = new Set<() => void>();
let snapshot: Active = { theme: "cream", section: "top" };
let stopFrame: (() => void) | null = null;

function compute(vh: number) {
  const probe = 32;
  let theme = snapshot.theme;
  document.querySelectorAll<HTMLElement>("main [data-theme]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe) theme = el.dataset.theme || theme;
  });
  let section = snapshot.section;
  document.querySelectorAll<HTMLElement>("main [data-section]").forEach((el) => {
    if (el.getBoundingClientRect().top <= vh * 0.45) section = el.dataset.section || section;
  });
  if (theme !== snapshot.theme || section !== snapshot.section) {
    snapshot = { theme, section };
    listeners.forEach((l) => l());
  }
}

function sub(cb: () => void) {
  listeners.add(cb);
  if (!stopFrame) stopFrame = onFrame((f) => compute(f.vh));
  return () => {
    listeners.delete(cb);
    if (!listeners.size && stopFrame) {
      stopFrame();
      stopFrame = null;
    }
  };
}

const server: Active = { theme: "cream", section: "top" };

export function useActive(): Active {
  return useSyncExternalStore(sub, () => snapshot, () => server);
}
