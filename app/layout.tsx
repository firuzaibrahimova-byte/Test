import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: "./fonts/bricolage-grotesque-latin.woff2",
  variable: "--font-display",
  weight: "400 800",
  display: "swap",
});
const text = localFont({
  src: "./fonts/geist-latin.woff2",
  variable: "--font-text",
  weight: "300 700",
  display: "swap",
});
const serif = localFont({
  src: [
    { path: "./fonts/instrument-serif-latin.woff2", weight: "400", style: "normal" },
    { path: "./fonts/instrument-serif-italic-latin.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Firuza Ibrahimova | Senior Product Designer",
  description:
    "Firuza Ibrahimova is a senior product designer in Baku. Enterprise SaaS, CRM and mobile products where the hard part is the process. Leads a team of four designers and organizes Friends of Figma Baku.",
  openGraph: {
    title: "Firuza Ibrahimova | Senior Product Designer",
    description: "Complex systems, made clear. Selected work, community and contact.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F3EFE4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** Runs before first paint so there is no flash of the wrong motion state. */
const bootstrap = `document.documentElement.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('rm');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
