"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { FACETS, PROJECTS, TIMELINE_YEARS, type FacetKey, type Project } from "@/lib/projects";

const CASES = PROJECTS.filter((p) => p.id !== "extra");
const pad = (n: number) => String(n).padStart(2, "0");
const years = (p: Project) =>
  p.from == null ? "" : p.from === p.to ? `${p.from}` : `${p.from}-${String(p.to).slice(2)}`;

/**
 * The index. Left: every project as a large type row. Right: a sticky
 * spotlight whose cards wipe past each other as you hover or focus rows.
 * Filtering dims non-matching rows and moves the spotlight to the first match.
 */
export function WorkIndex() {
  const [facet, setFacet] = useState<FacetKey>("ind");
  const [val, setVal] = useState("All");
  const [active, setActive] = useState("field");

  const matches = (p: Project) => p.id === "extra" || val === "All" || p[facet] === val;
  const shown = CASES.filter(matches);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    CASES.forEach((p) => { const k = p[facet]!; m.set(k, (m.get(k) ?? 0) + 1); });
    return m;
  }, [facet]);

  const pick = (nextFacet: FacetKey, nextVal: string) => {
    setFacet(nextFacet); setVal(nextVal);
    const ok = (p: Project) => p.id === "extra" || nextVal === "All" || p[nextFacet] === nextVal;
    const cur = PROJECTS.find((p) => p.id === active);
    if (!cur || !ok(cur)) setActive(PROJECTS.find((p) => ok(p))?.id ?? "extra");
  };

  const activeIdx = PROJECTS.findIndex((p) => p.id === active);

  return (
    <>
      <div className="fbar" role="group" aria-label="Filter projects">
        <span className="fbar-label">Explore by</span>
        <div className="facets" role="group" aria-label="Explore by">
          {FACETS.map((f) => (
            <button key={f.key} type="button" aria-pressed={facet === f.key} onClick={() => pick(f.key, "All")}>{f.label}</button>
          ))}
        </div>
        <div className="vals" role="group" aria-label="Filter values">
          <button type="button" aria-pressed={val === "All"} onClick={() => pick(facet, "All")}>All <small>{CASES.length}</small></button>
          {[...counts].map(([k, n]) => (
            <button key={k} type="button" aria-pressed={val === k} onClick={() => pick(facet, k)}>{k} <small>{n}</small></button>
          ))}
        </div>
        <span className="fcount" aria-live="polite">{shown.length} of {CASES.length} shown</span>
      </div>

      <div className="work-grid">
        <ol className="projs" role="list" aria-label="Projects">
          {PROJECTS.map((p, i) => {
            const m = matches(p);
            const meta = p.id === "extra" ? "Profile" : `${p.kind} · ${p[facet]}`;
            return (
              <li key={p.id} className={`proj${p.id === active ? " is-active" : ""}${m ? "" : " is-dim"}`} inert={!m}>
                <a
                  className="proj-row" href={p.href} data-cursor={p.cursor}
                  {...(p.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  onMouseEnter={() => m && setActive(p.id)} onFocus={() => m && setActive(p.id)}
                >
                  <span className="proj-num">{p.id === "extra" ? "+" : pad(i + 1)}</span>
                  <span className="proj-main">
                    <span className="proj-title">{p.title}</span>
                    <span className="proj-meta">{meta}</span>
                  </span>
                  <span className="proj-arrow" aria-hidden="true">{p.glyph}</span>
                  <span className="proj-more">
                    <span className="proj-problem">{p.problem}</span>
                    <span className="proj-metric"><b>{p.metric}</b> {p.mcap}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>

        <aside className="spot" aria-hidden="true">
          <div className="spot-stack">
            {PROJECTS.map((p, i) => {
              const on = i === activeIdx;
              const a = p.from != null ? p.from - TIMELINE_YEARS[0] + 1 : 1;
              const b = p.to != null ? p.to - TIMELINE_YEARS[0] + 2 : 1;
              const style = { "--sr": `${((i * 37) % 17) - 9}deg` } as CSSProperties;
              return (
                <article key={p.id} className={`card${on ? " is-on" : ""}${i < activeIdx ? " from-top" : ""}`} data-tone={p.tone} style={style}>
                  <div className="card-top">
                    <span className="card-num">{p.id === "extra" ? "+" : pad(i + 1)}</span>
                    <img className="card-sticker" src={p.sticker} alt="" />
                  </div>
                  <p className="card-meta">{p.kind}{p.ind ? ` · ${p.ind}` : ""}</p>
                  <h3 className="card-title">{p.title}</h3>
                  <p className="card-problem">{p.problem}</p>
                  {p.role && (
                    <dl className="card-facts">
                      <div><dt>Role</dt><dd>{p.role}</dd></div>
                      <div><dt>Platform</dt><dd>{p.plat}</dd></div>
                      <div><dt>Where</dt><dd>{p.where}, {years(p)}</dd></div>
                    </dl>
                  )}
                  <ul className="card-chips">{p.chips.map((c) => <li key={c}>{c}</li>)}</ul>
                  <div className="card-metric"><b>{p.metric}</b><span>{p.mcap}</span></div>
                  <div className="card-foot">
                    <span className="card-cta">{p.cta} <span>{p.glyph}</span></span>
                    {p.from != null && (
                      <div className="tl" style={{ "--a": a, "--b": b } as CSSProperties}>
                        <div className="tl-bar"><i /></div>
                        <div className="tl-years">{TIMELINE_YEARS.map((y) => <span key={y}>{y}</span>)}</div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </aside>
      </div>
    </>
  );
}
