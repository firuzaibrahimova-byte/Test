import { Letters } from "./Letters";

export function Hero() {
  return (
    <section className="hero" id="top" data-section="top" data-theme="cream" aria-label="Introduction">
      <div className="stage" data-hero>
        <canvas className="tangle" aria-hidden="true" />

        <div className="board" aria-hidden="true">
          <div className="drag drag-bulb" data-depth="0.5"><div className="drag-in" style={{ ["--rot" as string]: "-10deg" }}><img src="/stickers/bulb.svg" alt="" draggable={false} /></div></div>
          <div className="drag drag-spark" data-depth="0.35"><div className="drag-in"><img src="/stickers/spark.svg" alt="" draggable={false} /></div></div>
          <div className="drag drag-n1" data-depth="1"><div className="drag-in" style={{ ["--rot" as string]: "-3deg" }}><div className="note"><span className="note-t">Based in Baku, open to remote</span><span className="note-by"><i>F</i>Firuza</span></div></div></div>
          <div className="drag drag-n2" data-depth="0.8"><div className="drag-in" style={{ ["--rot" as string]: "2.5deg" }}><div className="note note-paper"><span className="note-t">Organizer at Friends of Figma Baku</span><span className="note-by"><i>F</i>Firuza</span></div></div></div>
          <div className="drag drag-n3" data-depth="1.2"><div className="drag-in" style={{ ["--rot" as string]: "-2deg" }}><div className="note"><span className="note-t">Leading a team of 4 designers</span><span className="note-by"><i>F</i>Firuza</span></div></div></div>
        </div>

        <div className="hero-head">
          <p className="pill">Complex systems, made clear</p>
          <h1 className="name" aria-label="Firuza Ibrahimova">
            <span className="name-line" aria-hidden="true"><Letters text="Firuza" /></span>
            <span className="name-line name-line-2" aria-hidden="true"><Letters text="Ibrahimova" offset={6} /></span>
          </h1>
          <p className="role">
            <span className="role-in"><i className="rule" aria-hidden="true" />Senior Product Designer<i className="rule" aria-hidden="true" /></span>
          </p>
        </div>

        <div className="hero-foot">
          <a className="btn btn-solid" href="#work" data-cursor="Go">See my work</a>
          <a className="btn btn-ghost" href="Contact.dc.html" data-cursor="Hello">Contact</a>
        </div>

        <div className="board-tool">
          <span className="board-tool-label"><i aria-hidden="true" />Board: drag the notes</span>
          <button type="button" className="board-reset">Reset board</button>
        </div>
      </div>
    </section>
  );
}
