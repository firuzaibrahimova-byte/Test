import { isReduced } from "../scroll";

/** Elements marked data-magnet lean toward the pointer when it comes near. */
export function initMagnet(): () => void {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-magnet]"));
  if (!els.length || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return () => {};
  const on = new Set<HTMLElement>();
  const move = (e: PointerEvent) => {
    if (isReduced()) return;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const reach = r.width * 0.95;
      if (Math.hypot(dx, dy) < reach) {
        el.classList.add("is-magnet"); on.add(el);
        el.style.setProperty("--mx", (dx * 0.28).toFixed(1) + "px");
        el.style.setProperty("--my", (dy * 0.28).toFixed(1) + "px");
      } else if (on.has(el)) {
        el.classList.remove("is-magnet"); on.delete(el);
        el.style.setProperty("--mx", "0px"); el.style.setProperty("--my", "0px");
      }
    }
  };
  window.addEventListener("pointermove", move, { passive: true });
  return () => window.removeEventListener("pointermove", move);
}
