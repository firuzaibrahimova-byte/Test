"use client";

import { useEffect } from "react";
import { initHero } from "@/lib/engine/hero";
import { initPan } from "@/lib/engine/pan";
import { initWords, initReveal, initFloats } from "@/lib/engine/text";
import { initBoard } from "@/lib/engine/board";
import { initMagnet } from "@/lib/engine/magnet";
import { isReduced } from "@/lib/scroll";

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** In-page anchors glide (scaled to distance), cancel on user input, and respect reduced motion. */
function initAnchors() {
  let raf = 0;
  const cancel = () => cancelAnimationFrame(raf);
  const onClick = (e: MouseEvent) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    const id = a.getAttribute("href")!.slice(1);
    const target = id === "top" ? document.body : document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const to = id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY;
    history.pushState(null, "", `#${id}`);
    if (isReduced()) { window.scrollTo(0, to); target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); return; }
    const from = window.scrollY, dist = to - from;
    const dur = Math.min(1700, Math.max(700, Math.abs(dist) * 0.45));
    const t0 = performance.now();
    cancel();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur);
      window.scrollTo(0, from + dist * ease(k));
      if (k < 1) raf = requestAnimationFrame(step);
      else { target.setAttribute("tabindex", "-1"); target.focus({ preventScroll: true }); }
    };
    raf = requestAnimationFrame(step);
  };
  document.addEventListener("click", onClick);
  window.addEventListener("wheel", cancel, { passive: true });
  window.addEventListener("touchstart", cancel, { passive: true });
  return () => { cancel(); document.removeEventListener("click", onClick); window.removeEventListener("wheel", cancel); window.removeEventListener("touchstart", cancel); };
}

/** Mounts every scroll-linked effect once, after hydration. Renders nothing. */
export function Motion() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => document.documentElement.classList.toggle("rm", mq.matches);
    sync();
    mq.addEventListener("change", sync);

    const stops: (() => void)[] = [initReveal(), initWords(), initFloats(), initMagnet(), initAnchors()];
    const stage = document.querySelector<HTMLElement>("[data-hero]");
    if (stage) { stops.push(initHero(stage)); stops.push(initBoard(stage)); }
    const pan = document.querySelector<HTMLElement>("[data-pan]");
    if (pan) stops.push(initPan(pan));

    return () => { mq.removeEventListener("change", sync); stops.forEach((s) => s()); };
  }, []);
  return null;
}
