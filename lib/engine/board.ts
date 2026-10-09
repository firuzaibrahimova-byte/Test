import { isReduced } from "../scroll";

interface Item { x: number; y: number; vx: number; vy: number; raf: number }

/** Draggable notes on the hero board. Pointer capture, throw inertia, bounded to the stage. */
export function initBoard(stage: HTMLElement): () => void {
  const items = Array.from(stage.querySelectorAll<HTMLElement>(".drag"));
  const state = new Map<HTMLElement, Item>();
  let z = 10;
  const cleanups: (() => void)[] = [];

  const apply = (el: HTMLElement, s: Item) => {
    el.style.setProperty("--tx", s.x.toFixed(1) + "px");
    el.style.setProperty("--ty", s.y.toFixed(1) + "px");
  };

  items.forEach((el) => {
    const s: Item = { x: 0, y: 0, vx: 0, vy: 0, raf: 0 };
    state.set(el, s);
    let sx = 0, sy = 0, bx = 0, by = 0, minX = 0, maxX = 0, minY = 0, maxY = 0, lx = 0, ly = 0, lt = 0, dragging = false;

    const bounds = () => {
      const sr = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
      minX = s.x + (sr.left + 6 - r.left); maxX = s.x + (sr.right - 6 - r.right);
      minY = s.y + (sr.top + 72 - r.top); maxY = s.y + (sr.bottom - 6 - r.bottom);
    };

    const down = (e: PointerEvent) => {
      cancelAnimationFrame(s.raf);
      el.classList.remove("is-return");
      try { el.setPointerCapture(e.pointerId); } catch { /* noop */ }
      dragging = true; el.classList.add("is-drag"); el.style.zIndex = String(++z);
      sx = e.clientX; sy = e.clientY; bx = s.x; by = s.y; lx = e.clientX; ly = e.clientY; lt = performance.now();
      s.vx = 0; s.vy = 0; bounds(); e.preventDefault();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      s.x = Math.min(maxX, Math.max(minX, bx + e.clientX - sx));
      s.y = Math.min(maxY, Math.max(minY, by + e.clientY - sy));
      const now = performance.now(), dt = Math.max(1, now - lt) / 1000;
      s.vx = s.vx * 0.6 + ((e.clientX - lx) / dt) * 0.4; s.vy = s.vy * 0.6 + ((e.clientY - ly) / dt) * 0.4;
      lx = e.clientX; ly = e.clientY; lt = now;
      apply(el, s);
    };
    const up = () => {
      if (!dragging) return;
      dragging = false; el.classList.remove("is-drag");
      if (performance.now() - lt > 90 || isReduced()) return;
      let last = performance.now();
      const glide = (t: number) => {
        const dt = Math.min(0.04, (t - last) / 1000); last = t;
        s.x += s.vx * dt; s.y += s.vy * dt;
        if (s.x < minX || s.x > maxX) { s.x = Math.min(maxX, Math.max(minX, s.x)); s.vx *= -0.35; }
        if (s.y < minY || s.y > maxY) { s.y = Math.min(maxY, Math.max(minY, s.y)); s.vy *= -0.35; }
        const k = Math.exp(-dt * 5); s.vx *= k; s.vy *= k;
        apply(el, s);
        if (Math.hypot(s.vx, s.vy) > 10) s.raf = requestAnimationFrame(glide);
      };
      s.raf = requestAnimationFrame(glide);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    cleanups.push(() => {
      cancelAnimationFrame(s.raf);
      el.removeEventListener("pointerdown", down); el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up); el.removeEventListener("pointercancel", up);
    });
  });

  const reset = stage.querySelector<HTMLButtonElement>(".board-reset");
  const onReset = () => {
    items.forEach((el) => {
      const s = state.get(el)!;
      cancelAnimationFrame(s.raf);
      el.classList.add("is-return");
      s.x = 0; s.y = 0; s.vx = 0; s.vy = 0; apply(el, s);
      window.setTimeout(() => el.classList.remove("is-return"), 800);
    });
  };
  reset?.addEventListener("click", onReset);
  cleanups.push(() => reset?.removeEventListener("click", onReset));

  return () => cleanups.forEach((c) => c());
}
