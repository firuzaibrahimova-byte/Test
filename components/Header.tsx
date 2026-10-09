"use client";

import { useEffect, useRef, useState } from "react";
import { useActive } from "@/lib/useActive";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "community", label: "Community" },
  { id: "contact", label: "Contact" },
];

const fmt = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Baku", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());

export function Header() {
  const { theme, section } = useActive();
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("--:--");
  const btn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);

  useEffect(() => {
    const tick = () => setTime(fmt());
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    if (!open) return;
    menu.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); btn.current?.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.classList.remove("menu-open"); };
  }, [open]);

  return (
    <>
      <header className="top" data-theme={open ? "cream" : theme}>
        <a className="brand" href="#top" aria-label="Firuza Ibrahimova, back to top" onClick={() => setOpen(false)}>Firuza Ibrahimova</a>
        <p className="top-meta">
          <span className="dot" aria-hidden="true" />
          <span>Open to remote</span>
          <span className="top-sep" aria-hidden="true" />
          <span>Baku <time suppressHydrationWarning>{time}</time></span>
        </p>
        <nav className="top-nav" aria-label="Primary">
          {LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} aria-current={section === l.id ? "true" : undefined}>{l.label}</a>
          ))}
        </nav>
        <button ref={btn} type="button" className="menu-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          {open ? "Close" : "Menu"}
        </button>
      </header>
      <nav id="menu" ref={menu} className="menu" aria-label="Primary mobile" hidden={!open}>
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>{l.label}</a>
        ))}
        <p className="menu-foot"><span className="dot" aria-hidden="true" />Senior Product Designer, Baku. Open to remote.</p>
      </nav>
    </>
  );
}
