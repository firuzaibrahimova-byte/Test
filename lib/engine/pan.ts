import { subscribe, clamp, isReduced } from "../scroll";

/**
 * Horizontal pan: vertical scroll distance is converted 1:1 into track
 * travel, so the section pins for exactly as long as the photos need.
 * Each photo counter-moves inside its frame for depth. Below 960px the
 * CSS turns this into a native swipe track and this module stands down.
 */
export function initPan(pan: HTMLElement): () => void {
  const track = pan.querySelector<HTMLElement>(".pan-track");
  const frames = Array.from(pan.querySelectorAll<HTMLElement>(".shot-img"));
  if (!track) return () => {};
  const mq = window.matchMedia("(min-width: 960px)");
  let dist = 0, active = false, ps = 0;

  const measure = () => {
    active = mq.matches && !isReduced();
    if (!active) {
      pan.style.removeProperty("--pan"); pan.style.removeProperty("--pp");
      frames.forEach((f) => f.style.removeProperty("--ix"));
      return;
    }
    dist = Math.max(0, track.scrollWidth - window.innerWidth);
    pan.style.setProperty("--pan", dist + "px");
  };

  const ro = new ResizeObserver(measure);
  ro.observe(track);
  window.addEventListener("resize", measure);
  mq.addEventListener("change", measure);
  measure();

  const un = subscribe((f) => {
    if (!active || dist <= 0) return;
    const r = pan.getBoundingClientRect();
    if (r.bottom < -100 || r.top > f.vh + 100) return;
    const p = clamp(-r.top / dist);
    ps += (p - ps) * (1 - Math.exp(-f.dt * 14));
    if (Math.abs(p - ps) < 0.0004) ps = p;
    pan.style.setProperty("--pp", ps.toFixed(4));
    for (const fr of frames) {
      const b = fr.getBoundingClientRect();
      const cx = b.left + b.width / 2;
      const ix = clamp((cx - f.vw / 2) * -0.07, -70, 70);
      fr.style.setProperty("--ix", ix.toFixed(1) + "px");
    }
  });

  return () => {
    un(); ro.disconnect();
    window.removeEventListener("resize", measure);
    mq.removeEventListener("change", measure);
  };
}
