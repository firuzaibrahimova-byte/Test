import Image from "next/image";
import { Split } from "./Split";
import { WorkIndex } from "./WorkIndex";

export function Brief() {
  return (
    <section className="brief" data-theme="cream" aria-label="What I do">
      <div className="wrap">
        <p className="brief-lead" data-words>
          <Split mode="scrub">I design <em>the clear path</em> through complex systems: enterprise SaaS, CRM and mobile products where the hard part is the process.</Split>
        </p>
        <dl className="stats">
          <div className="stat" data-reveal="line"><dt>years in product design</dt><dd><b data-count>4+</b></dd></div>
          <div className="stat" data-reveal="line"><dt>digital products</dt><dd><b data-count>15+</b></dd></div>
          <div className="stat" data-reveal="line"><dt>designers led</dt><dd><b data-count>4</b></dd></div>
        </dl>
      </div>
    </section>
  );
}

const FACTS: [string, string][] = [
  ["Based in", "Baku, Azerbaijan. Open to remote work."],
  ["Leading", "A team of four designers at PRODATA."],
  ["Experience", "4+ years and 15+ digital products."],
  ["Speaks", "Azerbaijani, English."],
  ["Background", "Chemical engineering first, then design."],
  ["Community", "Organizer, Friends of Figma Baku."],
];

export function About() {
  return (
    <section className="about" id="about" data-section="about" data-theme="yellow" aria-labelledby="about-h">
      <img className="float float-flow" src="/stickers/contracts.svg" alt="" aria-hidden="true" data-float="-0.12" />
      <div className="wrap about-grid">
        <div className="about-l" data-words-scope>
          <div className="about-sticky">
            <h2 id="about-h" className="h2" data-mask><Split mode="mask">A few things about me</Split></h2>
            <p className="about-p" data-words>
              <Split mode="scrub">I started in chemical engineering and moved into product design through Baku Design Academy. Today I lead a small design team, work on rule-heavy enterprise products, and spend my evenings building Baku&apos;s design community.</Split>
            </p>
            <a className="link-arrow" href="About.dc.html" data-cursor="Open">Full profile and timeline <span aria-hidden="true">→</span></a>
          </div>
        </div>
        <dl className="facts">
          {FACTS.map(([k, v]) => (
            <div className="fact" data-reveal="line" key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const SHOTS = [
  { src: "/img/fof-meetup.webp", w: 1280, h: 960, ar: "4/3", alt: "A large group of designers at a Friends of Figma Baku meetup", cap: "Friends of Figma Baku meetup" },
  { src: "/img/config-watch-party.webp", w: 1280, h: 960, ar: "4/3", alt: "The organizing team at a Figma Config watch party", cap: "The organizing team at a Config watch party" },
  { src: "/img/fof-stickers.webp", w: 956, h: 1234, ar: "956/1234", alt: "Friends of Figma Baku stickers", cap: "Stickers, because every meetup needs them" },
];

const ACTS = ["Hands-on workshops", "Panel discussions and talks", "Figma Config watch parties", "Networking evenings and online meetups"];

export function Community() {
  return (
    <section className="community" id="community" data-section="community" data-theme="forest" aria-labelledby="beyond">
      <div className="wrap community-intro">
        <h2 id="beyond" className="h2 h2-xl" data-mask>
          <Split mode="mask">Beyond the work, I build <em>the room</em> where designers meet.</Split>
        </h2>
        <p className="community-sub" data-reveal="rise">Design is a social practice for me. Most of my evenings outside product work go into people, conversations and the local design scene.</p>
      </div>

      <div className="pan" data-pan>
        <div className="pan-stage">
          <ul className="pan-track" role="list">
            {SHOTS.map((s, i) => (
              <li className={`shot shot-${i + 1}`} key={s.src} style={{ ["--ar" as string]: s.ar }}>
                <figure>
                  <div className="shot-img">
                    <Image src={s.src} width={s.w} height={s.h} alt={s.alt} sizes="(max-width: 960px) 80vw, 60vw" loading="eager" />
                  </div>
                  <figcaption>{s.cap}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
          <span className="pan-bar" aria-hidden="true"><span className="pan-bar-fill" /></span>
        </div>
      </div>

      <div className="wrap fof">
        <article className="fof-main">
          <p className="fof-kicker" data-reveal="rise">Event organizer and community leader</p>
          <h3 className="h3" data-mask><Split mode="mask">Friends of Figma Baku</Split></h3>
          <p className="fof-p" data-reveal="rise">I co-organize the official local Figma community, bringing designers, developers and product people into the same room.</p>
          <p className="fof-big" data-reveal="rise"><b>2-3</b><span>events a month</span></p>
        </article>
        <div className="fof-side">
          <ol className="acts">
            {ACTS.map((a, i) => (
              <li data-reveal="line" key={a}><span className="acts-n">{String(i + 1).padStart(2, "0")}</span><span className="acts-t">{a}</span></li>
            ))}
          </ol>
          <ul className="chips" aria-label="Topics" data-reveal="rise">
            <li>Design</li><li>AI</li><li>Technology</li><li>Future of product</li>
          </ul>
        </div>
      </div>

      <div className="wrap off">
        <div className="off-head" data-reveal="rise">
          <h3 className="h3 h3-s">Off the clock</h3>
          <p>The interests that shape how I see people and products.</p>
        </div>
        <ul className="off-list">
          <li data-reveal="line"><span>[Hobby or interest 1]</span><span>[One line on what it is and why you love it]</span></li>
          <li data-reveal="line"><span>[Hobby or interest 2]</span><span>[One line, ideally something unexpected]</span></li>
          <li data-reveal="line"><span>[Hobby or interest 3]</span><span>[One line, something you do with other people]</span></li>
        </ul>
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section className="work" id="work" data-section="work" data-theme="cream" aria-labelledby="work-h">
      <div className="wrap">
        <header className="work-head">
          <h2 id="work-h" className="h2 h2-xl" data-mask><Split mode="mask">Selected work</Split></h2>
          <p className="work-sub" data-reveal="rise">Four case studies and three briefs. Filter them, then open the one you want to read.</p>
        </header>
        <WorkIndex />
      </div>
    </section>
  );
}

export function Close() {
  return (
    <section className="close" id="contact" data-section="contact" data-theme="yellow" aria-labelledby="close-h">
      <img className="float float-pen" src="/stickers/pen.svg" alt="" aria-hidden="true" data-float="-0.1" />
      <div className="wrap close-grid">
        <h2 id="close-h" className="close-h" data-mask><Split mode="mask">Have a workflow nobody wants to touch?</Split></h2>
        <a className="orb" href="Contact.dc.html" data-magnet data-cursor="Say hi"><span className="orb-in">Contact <i aria-hidden="true">→</i></span></a>
      </div>
      <footer className="foot wrap">
        <p>Firuza Ibrahimova, Senior Product Designer. Baku, open to remote.</p>
        <nav aria-label="Footer">
          <a href="#work">Work</a><a href="#about">About</a><a href="#community">Community</a><a href="#top">Back to top <span aria-hidden="true">↑</span></a>
        </nav>
      </footer>
    </section>
  );
}
