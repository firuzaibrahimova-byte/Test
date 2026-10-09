"use client";

import { useEffect, useRef } from "react";
import { useActive } from "@/lib/useActive";
import { subscribe, clamp } from "@/lib/scroll";

const STOPS = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "community", label: "Community" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

/** Section navigation that doubles as a page-progress line. */
export function Rail() {
  const { theme, section } = useActive();
  const ref = useRef<HTMLElement>(null);

  useEffect(
    () =>
      subscribe((f) => {
        const max = document.documentElement.scrollHeight - f.vh;
        ref.current?.style.setProperty("--rp", (max > 0 ? clamp(f.y / max) : 0).toFixed(4));
      }),
    [],
  );

  return (
    <nav ref={ref} className="rail" aria-label="Page sections" data-theme={theme}>
      <span className="rail-line" aria-hidden="true"><span className="rail-fill" /></span>
      {STOPS.map((s) => (
        <a key={s.id} href={`#${s.id}`} aria-current={section === s.id ? "true" : undefined}>
          <span className="rail-label">{s.label}</span>
          <i />
        </a>
      ))}
    </nav>
  );
}
