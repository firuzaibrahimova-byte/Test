export type Tone = "dark" | "yellow" | "paper" | "mint";
export type FacetKey = "ind" | "prod" | "role" | "plat";

export interface Project {
  id: string;
  title: string;
  tone: Tone;
  kind: "Case study" | "Live product" | "Brief" | "Profile";
  ind?: string;
  prod?: string;
  role?: string;
  plat?: string;
  where?: string;
  from?: number;
  to?: number;
  problem: string;
  metric: string;
  mcap: string;
  chips: string[];
  sticker: string;
  href: string;
  external?: boolean;
  glyph: string;
  cta: string;
  cursor: string;
}

/** Source of truth for the work index. Copy is unchanged from the original design. */
export const PROJECTS: Project[] = [
  {
    id: "field", title: "Field and Agronomy", tone: "dark", kind: "Case study",
    ind: "Agriculture", prod: "Mobile app", role: "Lead designer", plat: "Mobile",
    where: "AgrOne", from: 2023, to: 2026,
    problem: "A rule-heavy agricultural workflow that a farmer can finish on a phone.",
    metric: "Map-first", mcap: "fields are drawn, not typed",
    chips: ["Map-first", "Geozones", "5-step signing"],
    sticker: "/stickers/field.svg", href: "Case-Field.dc.html", glyph: "→", cta: "Open case study", cursor: "Open",
  },
  {
    id: "contracts", title: "Contract Management", tone: "yellow", kind: "Case study",
    ind: "Agriculture", prod: "Enterprise SaaS", role: "Lead designer", plat: "Web",
    where: "AgrOne", from: 2023, to: 2026,
    problem: "One contract, three authorities, three verification chains and two ways to sign.",
    metric: "~30%", mcap: "fewer contract support tickets",
    chips: ["3 authorities", "3 verification chains", "2 ways to sign"],
    sticker: "/stickers/contracts.svg", href: "Case-Contracts.dc.html", glyph: "→", cta: "Open case study", cursor: "Open",
  },
  {
    id: "goals", title: "Goal Management", tone: "paper", kind: "Case study",
    ind: "HR and performance", prod: "Enterprise SaaS", role: "Lead designer", plat: "Web",
    where: "AgrOne", from: 2023, to: 2026,
    problem: "Four goal types, dual-track approval and cascades that run both ways, made predictable.",
    metric: "~35%", mcap: "faster manager approval queue",
    chips: ["4 goal types", "Dual-track approval", "Cascades"],
    sticker: "/stickers/goals.svg", href: "Case-Goals.dc.html", glyph: "→", cta: "Open case study", cursor: "Open",
  },
  {
    id: "trust", title: "Trust in Mental Health Apps", tone: "dark", kind: "Case study",
    ind: "Health", prod: "Research", role: "UX researcher", plat: "Study",
    where: "Research", from: 2025, to: 2025,
    problem: "What design and content factors build or break trust in mental health platforms?",
    metric: "5 of 5", mcap: "could not verify a therapist's license",
    chips: ["6 interviews", "5 usability sessions", "8 weeks"],
    sticker: "/stickers/trust.svg", href: "Case-Trust.dc.html", glyph: "→", cta: "Open case study", cursor: "Open",
  },
  {
    id: "sneeky", title: "Sneeky", tone: "paper", kind: "Live product",
    ind: "Fashion and AI", prod: "Consumer web", role: "Freelance designer", plat: "Web",
    where: "Freelance", from: 2024, to: 2024,
    problem: "Turning outfit inspiration into shoppable products, with AI doing the searching.",
    metric: "Live", mcap: "sneekyapp.com",
    chips: ["Outfit to product", "AI-assisted", "Live product"],
    sticker: "/stickers/sneeky.svg", href: "https://sneekyapp.com", external: true, glyph: "↗", cta: "Visit the live product", cursor: "Visit",
  },
  {
    id: "grecho", title: "Grecho", tone: "yellow", kind: "Brief",
    ind: "Risk management", prod: "Enterprise SaaS", role: "Designer and PM", plat: "Web",
    where: "Brief", from: 2024, to: 2025,
    problem: "Helping organizations identify, assess and mitigate risk.",
    metric: "In preparation", mcap: "full case study coming",
    chips: ["Identify", "Assess", "Mitigate"],
    sticker: "/stickers/grecho.svg", href: "Contact.dc.html", glyph: "?", cta: "Ask me about it", cursor: "Ask",
  },
  {
    id: "lms", title: "University LMS", tone: "paper", kind: "Brief",
    ind: "Education", prod: "Enterprise SaaS", role: "UX/UI designer", plat: "Web",
    where: "TIM Consulting", from: 2022, to: 2023,
    problem: "Learning management systems for SDU, MDU and ADAU, built with an agile team of developers and BAs.",
    metric: "3", mcap: "universities",
    chips: ["SDU", "MDU", "ADAU"],
    sticker: "/stickers/lms.svg", href: "Contact.dc.html", glyph: "?", cta: "Ask me about it", cursor: "Ask",
  },
  {
    id: "extra", title: "How I work", tone: "mint", kind: "Profile",
    problem: "Process, roles, states, actions, then interface. The method behind every project.",
    metric: "About me", mcap: "timeline, method, toolkit",
    chips: ["Process", "Roles", "States", "Actions", "Interface"],
    sticker: "/stickers/extra.svg", href: "About.dc.html", glyph: "→", cta: "Open profile", cursor: "Open",
  },
];

export const FACETS: { key: FacetKey; label: string }[] = [
  { key: "ind", label: "Industry" },
  { key: "prod", label: "Product" },
  { key: "role", label: "Role" },
  { key: "plat", label: "Platform" },
];

export const TIMELINE_YEARS = [2022, 2023, 2024, 2025, 2026];
