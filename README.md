# Firuza Ibrahimova, portfolio

Next.js (App Router, TypeScript). No runtime dependencies beyond React and Next; all scroll
motion is hand-written in `lib/engine/` on a single shared rAF loop with native scrolling.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Where things live

| Path | What |
| --- | --- |
| `app/globals.css` | All styling: tokens, chrome, one section per chapter, motion states, responsive |
| `components/Hero.tsx`, `Sections.tsx` | Server-rendered chapters (hero, brief, about, community, work, close) |
| `components/WorkIndex.tsx` | Client: filters + sticky spotlight |
| `lib/projects.ts` | Project data. **Edit links, copy and years here** |
| `lib/engine/` | Hero tangle, horizontal pan, word scrub, reveals, notes board, magnet |
| `public/img`, `public/stickers` | Photos (webp) and the sticker set |

## Before publishing

- **Links.** Case studies, `About.dc.html` and `Contact.dc.html` still point at the original
  Claude Design pages. Change `href` values in `lib/projects.ts`, `components/Hero.tsx` and
  `components/Sections.tsx` once those pages exist.
- **Placeholders.** "Off the clock" still holds bracketed placeholders (`components/Sections.tsx`).
- **Email.** No address is published; add one to the close section if you want it visible.

## Motion and accessibility

`prefers-reduced-motion` skips pinning, scrubbing and the marquee and shows the resolved state
immediately. Below 960px the photo pan becomes a native swipe track and the work spotlight is
replaced by per-row detail. The decorative notes board is `aria-hidden`.
