import { subscribe, clamp, lerp, smooth, isReduced } from "../scroll";

/**
 * Hero: the peak of the page. `--e` (0 to 1) is the "clarity" value:
 * at 0 the name is jittered and a dozen strands tangle behind it; at 1
 * the letters sit square and every strand has collapsed into one line
 * running through the role. Scroll drives e; a damped follower smooths it.
 */
const FOREST = "19,57,43";

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STRANDS = 13;
const POINTS = 9;

export function initHero(stage: HTMLElement): () => void {
  const section = stage.parentElement as HTMLElement;
  const canvas = stage.querySelector<HTMLCanvasElement>(".tangle");
  const role = stage.querySelector<HTMLElement>(".role");
  const head = stage.querySelector<HTMLElement>(".hero-head");
  const name = stage.querySelector<HTMLElement>(".name");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx || !role || !head || !name) return () => {};

  const rnd = mulberry32(11);
  const strands = Array.from({ length: STRANDS }, (_, s) => ({
    hi: s === 0,
    amp: 0.55 + rnd() * 0.45,
    spread: (rnd() - 0.5) * 0.2,
    ry: Array.from({ length: POINTS }, () => rnd() * 2 - 1),
    ph: Array.from({ length: POINTS }, () => rnd() * Math.PI * 2),
    sp: Array.from({ length: POINTS }, () => 0.5 + rnd() * 1.1),
  }));

  let W = 0, H = 0, yc = 0, cy0 = 0, gut = 0;
  let ed = 0, lastE = -1;
  let mx = -9999, my = -9999;
  let nx = 0, ny = 0, snx = 0, sny = 0;
  const mouse = { on: false };
  const drags = Array.from(stage.querySelectorAll<HTMLElement>(".drag"));
  const par = drags.map(() => ({ x: 0, y: 0 }));

  const measure = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const sr = stage.getBoundingClientRect();
    W = stage.clientWidth; H = stage.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rr = role.getBoundingClientRect();
    const nr = name.getBoundingClientRect();
    yc = rr.top + rr.height / 2 - sr.top;
    cy0 = nr.top + nr.height / 2 - sr.top;
    gut = parseFloat(getComputedStyle(head).paddingLeft) || 24;
    draw(performance.now(), ed);
  };

  const draw = (t: number, e: number) => {
    ctx.clearRect(0, 0, W, H);
    const mess = Math.pow(1 - e, 1.15);
    const c = lerp(cy0, yc, e);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const order = [...strands].sort((a, b) => Number(b.hi) - Number(a.hi));
    for (const s of order) {
      const pts: [number, number][] = [];
      for (let k = 0; k < POINTS; k++) {
        const x = -0.06 * W + (k / (POINTS - 1)) * 1.12 * W;
        let y = c + mess * (s.spread * H + H * 0.34 * s.amp * s.ry[k] + H * 0.022 * Math.sin(t * 0.0006 * s.sp[k] + s.ph[k]));
        if (mouse.on && mess > 0.02) {
          const dx = x - mx, dy = y - my;
          const f = Math.exp(-(dx * dx + dy * dy) / (2 * 150 * 150));
          y += (dy >= 0 ? 1 : -1) * f * 80 * mess;
        }
        pts.push([x, y]);
      }
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        ctx.bezierCurveTo(
          p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6,
          p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6,
          p2[0], p2[1],
        );
      }
      if (s.hi) { ctx.strokeStyle = "#F5C842"; ctx.lineWidth = lerp(6, 11, e); }
      else { ctx.strokeStyle = `rgba(${FOREST},${lerp(0.42, 0.95, e)})`; ctx.lineWidth = lerp(1.3, 2.6, e); }
      ctx.stroke();
    }
    const na = smooth(clamp((e - 0.72) / 0.28));
    if (na > 0.01) {
      ctx.globalAlpha = na;
      for (const x of [gut, W - gut]) {
        ctx.beginPath(); ctx.arc(x, yc, 9, 0, Math.PI * 2);
        ctx.fillStyle = "#F3EFE4"; ctx.fill();
        ctx.lineWidth = 2.6; ctx.strokeStyle = "#13392B"; ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };

  const onMove = (ev: PointerEvent) => {
    if (ev.pointerType === "touch") return;
    const r = stage.getBoundingClientRect();
    mx = ev.clientX - r.left; my = ev.clientY - r.top; mouse.on = true;
    nx = (mx / W - 0.5) * 2; ny = (my / H - 0.5) * 2;
  };
  const onLeave = () => { mouse.on = false; nx = 0; ny = 0; };
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);

  const ro = new ResizeObserver(measure);
  ro.observe(stage);
  document.fonts?.ready.then(measure);
  measure();

  let reduced = isReduced();
  let lastDrawE = -1;
  const un = subscribe((f) => {
    reduced = isReduced();
    const r = section.getBoundingClientRect();
    if (r.bottom < -80 || r.top > f.vh) return;
    const total = Math.max(1, section.offsetHeight - f.vh);
    const p = reduced ? 1 : clamp(-r.top / total);
    const target = reduced ? 1 : smooth(clamp((p - 0.03) / 0.8));
    ed = reduced ? 1 : ed + (target - ed) * (1 - Math.exp(-f.dt * 8));
    if (Math.abs(target - ed) < 0.0005) ed = target;
    if (Math.abs(ed - lastE) > 0.0003) { stage.style.setProperty("--e", ed.toFixed(4)); lastE = ed; }

    // depth: pointer parallax + scroll drift, different rate per layer
    if (!reduced) {
      snx += (nx - snx) * (1 - Math.exp(-f.dt * 6));
      sny += (ny - sny) * (1 - Math.exp(-f.dt * 6));
      name.style.setProperty("--nx", (-snx * 7).toFixed(2) + "px");
      name.style.setProperty("--ny", (-sny * 5).toFixed(2) + "px");
      drags.forEach((d, i) => {
        const depth = parseFloat(d.dataset.depth || "1");
        const x = snx * 16 * depth;
        const drift = parseFloat(d.dataset.drift || "-1");
        const y = sny * 12 * depth + ed * 46 * depth * drift;
        if (Math.abs(x - par[i].x) > 0.05 || Math.abs(y - par[i].y) > 0.05) {
          par[i].x = x; par[i].y = y;
          d.style.setProperty("--mx", x.toFixed(2) + "px");
          d.style.setProperty("--my", y.toFixed(2) + "px");
        }
      });
    }
    const settled = ed >= 0.9995;
    if (!settled || lastDrawE !== 1) draw(f.t, settled ? 1 : ed);
    lastDrawE = settled ? 1 : ed;
  });

  return () => {
    un(); ro.disconnect();
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
  };
}
