"use client";

import { useEffect, useRef } from "react";

/**
 * A Figma-multiplayer-style cursor that trails the real pointer and renames
 * itself by context (data-cursor). The system cursor is never hidden.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current, label = tag.current;
    if (!el || !label) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches || document.documentElement.classList.contains("rm")) return;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, seen = false, text = "Firuza";
    const set = (t: string, link: boolean) => {
      if (t !== text) { text = t; label.textContent = t; }
      el.classList.toggle("is-link", link);
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY;
      if (!seen) { x = tx; y = ty; seen = true; }
      el.classList.add("on");
      const t = e.target as Element | null;
      const host = t?.closest<HTMLElement>("[data-cursor], .drag, a, button");
      if (host?.classList.contains("drag")) set("Drag", true);
      else if (host?.dataset.cursor) set(host.dataset.cursor, true);
      else if (host) set("Firuza", true);
      else set("Firuza", false);
    };
    const leave = () => el.classList.remove("on");
    const loop = () => {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div className="cursor" ref={root} aria-hidden="true">
      <img className="cursor-arrow" src="/stickers/cursor.svg" alt="" width={22} height={22} />
      <span className="cursor-tag" ref={tag}>Firuza</span>
    </div>
  );
}
