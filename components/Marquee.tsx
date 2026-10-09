"use client";

import { useEffect, useRef, useState } from "react";
import { subscribe, isReduced } from "@/lib/scroll";

const ITEMS = ["Enterprise SaaS", "CRM", "Mobile apps", "Agriculture", "HR and performance", "Health", "Fashion and AI", "Risk management", "Education"];

/** Industry band. Drifts on its own; scroll speeds it up and flips its direction. */
export function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  pausedRef.current = paused;

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let x = 0, dir = 1, w = 0;
    const measure = () => { w = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0; };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const un = subscribe((f) => {
      if (isReduced() || pausedRef.current || !w) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > f.vh + 50) return;
      if (Math.abs(f.vel) > 40) dir += (Math.sign(f.vel) - dir) * 0.08;
      const speed = 64 + Math.min(Math.abs(f.vel) * 0.45, 800);
      x -= dir * speed * f.dt;
      x = ((x % w) - w) % w;
      el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
    });
    return () => { un(); ro.disconnect(); };
  }, []);

  return (
    <div className="marquee" data-theme="forest" role="group" aria-label="Industries I have worked in">
      <div className="marquee-track" ref={track}>
        {[0, 1, 2].map((n) => (
          <ul className="marquee-set" key={n} aria-hidden={n > 0 ? true : undefined}>
            {ITEMS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        ))}
      </div>
      <button type="button" className="marquee-pause" aria-pressed={paused} onClick={() => setPaused((p) => !p)}>
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
