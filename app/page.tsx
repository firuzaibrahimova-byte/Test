import { Header } from "@/components/Header";
import { Rail } from "@/components/Rail";
import { Cursor } from "@/components/Cursor";
import { Motion } from "@/components/Motion";
import { Marquee } from "@/components/Marquee";
import { Hero } from "@/components/Hero";
import { Brief, About, Community, Work, Close } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Header />
      <Rail />
      <Cursor />
      <main id="main">
        <Hero />
        <Brief />
        <Marquee />
        <About />
        <Community />
        <Work />
        <Close />
      </main>
      <Motion />
    </>
  );
}
