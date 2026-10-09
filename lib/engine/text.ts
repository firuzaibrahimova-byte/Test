import { subscribe, clamp, isReduced } from "../scroll";

/** Reading scrub: each word resolves from faint to full as its block scrolls through. */
export function initWords(): () => void {
  const items = Array.from(document.querySelectorAll<HTMLElement>("[data-words]")).map((el) => ({
    el,
    scope: el.closest<HTMLElement>("[data-words-scope]"),
    words: Array.from(el.querySelectorAll<HTMLElement>(".w")),
    last: [] as number[],
  }));
  const paint = (it: (typeof items)[number], p: number) => {
    const n = it.words.length;
    for (let i = 0; i < n; i++) {
      const v = Math.round((0.14 + 0.86 * clamp((p * (n + 6) - i) / 6)) * 50) / 50;
      if (it.last[i] !== v) { it.words[i].style.opacity = String(v); it.last[i] = v; }
    }
  };
  return subscribe((f) => {
    for (const it of items) {
      if (isReduced()) { if (it.last[0] !== 1) paint(it, 1); continue; }
      const r = (it.scope ?? it.el).getBoundingClientRect();
      if (r.bottom < -120 || r.top > f.vh + 120) continue;
      const p = it.scope
        ? clamp((f.vh * 0.6 - r.top) / (r.height * 0.75))
        : clamp((f.vh * 0.9 - r.top) / (f.vh * 0.5 + r.height));
      paint(it, p);
    }
  });
}

function countUp(host: Element) {
  host.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const to = el.dataset.to ?? el.textContent ?? "";
    const m = to.match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10), suffix = m[2];
    if (isReduced()) { el.textContent = to; return; }
    const t0 = performance.now(), dur = 1500;
    const step = (t: number) => {
      const k = clamp((t - t0) / dur);
      const v = 1 - Math.pow(2, -10 * k);
      el.textContent = Math.round(target * (k >= 1 ? 1 : v)) + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
}

/** Enter reveals: rises, drawn hairlines, masked heading words, count-ups. */
export function initReveal(): () => void {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-mask]"));
  document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    el.dataset.to = el.dataset.to ?? el.textContent ?? "";
    const m = el.dataset.to.match(/^(\d+)(.*)$/);
    if (m && !isReduced()) el.textContent = "0" + m[2];
  });
  if (isReduced() || !("IntersectionObserver" in window)) {
    els.forEach((el) => { el.classList.add("in"); countUp(el); });
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        countUp(e.target);
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );
  els.forEach((el) => io.observe(el));
  return () => io.disconnect();
}

/** Floating stickers drift at their own rate against the page. */
export function initFloats(): () => void {
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-float]"));
  return subscribe((f) => {
    if (isReduced()) return;
    for (const el of els) {
      const host = el.parentElement!.getBoundingClientRect();
      if (host.bottom < -200 || host.top > f.vh + 200) continue;
      const k = parseFloat(el.dataset.float || "0.1");
      el.style.setProperty("--fy", ((host.top + host.height / 2 - f.vh / 2) * k).toFixed(1) + "px");
    }
  });
}
