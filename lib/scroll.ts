/**
 * One rAF loop shared by every scroll-linked effect. Native scrolling stays
 * untouched (no scroll-jacking); effects read the frame and write CSS
 * variables or transforms. The loop only runs while something subscribes and
 * the tab is visible.
 */
export interface Frame {
  y: number;
  vh: number;
  vw: number;
  /** seconds since last frame, clamped */
  dt: number;
  /** smoothed scroll velocity in px/s (signed) */
  vel: number;
  /** ms timestamp */
  t: number;
}

type Subscriber = (f: Frame) => void;

const subs = new Set<Subscriber>();
let raf = 0;
let last = 0;
let lastY = 0;
let vel = 0;

function tick(t: number) {
  const dt = Math.min(0.05, last ? (t - last) / 1000 : 0.016);
  last = t;
  const y = window.scrollY;
  const inst = dt > 0 ? (y - lastY) / dt : 0;
  vel += (inst - vel) * (1 - Math.exp(-dt * 10));
  lastY = y;
  const frame: Frame = { y, vh: window.innerHeight, vw: window.innerWidth, dt, vel, t };
  subs.forEach((s) => s(frame));
  raf = requestAnimationFrame(tick);
}

function start() {
  if (raf || typeof window === "undefined") return;
  last = 0;
  lastY = window.scrollY;
  raf = requestAnimationFrame(tick);
}

function stop() {
  cancelAnimationFrame(raf);
  raf = 0;
}

function onVisibility() {
  if (document.hidden) stop();
  else if (subs.size) start();
}

export function subscribe(fn: Subscriber): () => void {
  subs.add(fn);
  if (subs.size === 1) document.addEventListener("visibilitychange", onVisibility);
  start();
  return () => {
    subs.delete(fn);
    if (!subs.size) {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const isReduced = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("rm");
