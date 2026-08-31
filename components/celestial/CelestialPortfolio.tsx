"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PointerEvent } from "react";
import { useLenis } from "lenis/react";
import type { WorldInput } from "./createMoonWorld";
import styles from "./celestial.module.css";

const projects = [
  { number: "01", title: "Inventory Management System", name: "Systems", description: "Stock, customers, staff, and financial visibility for Pakistan’s solar market.", detail: "A full-stack product built around the everyday reality of business operations.", tools: "Next.js / TypeScript / Node.js / MongoDB", scope: "Business operations", symbol: "◈" },
  { number: "02", title: "Job Application Tracker", name: "Experiments", description: "A focused place for applications, follow-ups, status, and review.", detail: "An experiment in making a complicated personal workflow feel deliberate and manageable.", tools: "React / Node.js / MongoDB", scope: "Workflow product", symbol: "✧" },
  { number: "03", title: "Headphones Affiliate Project", name: "Origins", description: "Built, grown, monetized, and sold. My first complete commercial loop.", detail: "Where search intent, useful content, and a working business became part of the same story.", tools: "WordPress / SEO / Content strategy", scope: "Built, grown & sold", symbol: "◇" },
];
const query = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function Emblem({ className = "" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M32 2 37 24 60 32 37 39 32 62 26 39 4 32 26 24Z" stroke="currentColor" /><circle cx="32" cy="32" r="16" stroke="currentColor" opacity=".6" /><path d="m32 20 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="currentColor" /></svg>;
}

export function CelestialPortfolio() {
  const root = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLDivElement>(null);
  const layout = useRef<{ height: number; stops: number[]; end: number } | null>(null);
  const input = useRef<WorldInput>({ travel: 0, turn: 0, tilt: 0, light: .4, paused: false, reduced: false });
  const [sceneState, setSceneState] = useState<"loading" | "ready" | "fallback">("loading");
  const [paused, setPaused] = useState(false);
  const [light, setLight] = useState(.4);
  const [selected, setSelected] = useState(0);
  const [chapter, setChapter] = useState(0);
  const chapterRef = useRef(0);
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia(query).matches, () => false);
  const project = projects[selected];

  const update = useCallback((scroll: number) => {
    const measured = layout.current;
    if (!measured) return;
    const { height, stops, end } = measured;
    const boundaries = [...stops, end];
    const positions = [0, 1.3, 2.8, 4, 4.4];
    let segment = 0;
    while (segment < 3 && scroll > boundaries[segment + 1]) segment++;
    const progress = Math.min(1, Math.max(0, (scroll-boundaries[segment]) / Math.max(1, boundaries[segment+1]-boundaries[segment])));
    const travel = positions[segment] + (positions[segment+1]-positions[segment]) * progress;
    input.current.travel = travel;
    root.current?.style.setProperty("--travel", travel.toFixed(4));
    const limit = (value: number) => Math.min(1,Math.max(0,value));
    const heroFade = limit(1-scroll/Math.max(1,stops[1]*.65));
    root.current?.style.setProperty("--hero-fade", String(heroFade));
    root.current?.style.setProperty("--atlas-fade", String(limit((stops[2]-scroll-height*.2)/(height*.65))));
    root.current?.style.setProperty("--maker-fade", String(limit((scroll-stops[2]+height*.65)/(height*.5))*limit((stops[3]-scroll-height*.15)/(height*.5))));
    if (hero.current) hero.current.inert = !input.current.reduced && heroFade < .05;
    let next = 0;
    stops.forEach((top, i) => { if (scroll + height*.4 >= top) next = i; });
    if (next !== chapterRef.current) { chapterRef.current = next; setChapter(next); }
  }, []);
  useLenis(instance => update(instance.scroll), [update]);

  useEffect(() => {
    input.current.paused = paused; input.current.reduced = reduced; input.current.light = light;
    update(window.scrollY);
  }, [paused, reduced, light, update]);

  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    import("./createMoonWorld").then(({ createMoonWorld }) => {
      if (disposed || !host.current) return;
      try {
        cleanup = createMoonWorld(host.current, { input, onReady: () => { if (!disposed) setSceneState("ready"); }, onFailure: () => { if (!disposed) setSceneState("fallback"); } });
      } catch { setSceneState("fallback"); }
    }).catch(() => { if (!disposed) setSceneState("fallback"); });
    const onScroll = () => update(window.scrollY);
    const measure = () => {
      if (disposed || !root.current) return;
      const sections = [...root.current.querySelectorAll<HTMLElement>('main > section')];
      layout.current = {
        height: Math.max(1,window.innerHeight),
        stops: sections.map(section => section.getBoundingClientRect().top+window.scrollY),
        end: Math.max(1,document.documentElement.scrollHeight-window.innerHeight),
      };
      onScroll();
    };
    const observer = new ResizeObserver(measure);
    if (root.current) {
      observer.observe(root.current);
      root.current.querySelectorAll('main > section').forEach(section=>observer.observe(section));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    document.fonts.ready.then(measure);
    measure();
    return () => { disposed = true; cleanup?.(); observer.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", measure); };
  }, [update]);

  const rotate = (direction: number) => { input.current.turn += direction * .3; };
  const pointLight = (event: PointerEvent<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setLight(Math.round(Math.min(1,Math.max(0,(event.clientX-rect.left)/rect.width))*100)/100);
  };

  return (
    <div ref={root} className={styles.world} data-chapter={chapter} data-motion={reduced ? "reduced" : "full"}>
      <div className={styles.sky} aria-hidden="true" />
      <div className={styles.fallbackMoon} data-hidden={sceneState === "ready"} aria-hidden="true" />
      <div ref={host} className={styles.scene} data-ready={sceneState === "ready"} aria-label="Interactive moon" />
      <svg className={styles.constellations} viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g stroke="currentColor" strokeWidth=".6" fill="none"><path d="m72 230 73-74 122 35 25 116-96 42-124-119m73-74 51 193"/><path d="m1310 155 70 63 95-25 58 110-112 72-80-68 39-89"/><path d="m1120 770 53 84 109-33 67 49 74-115"/></g>
        <g fill="currentColor">{[[72,230],[145,156],[267,191],[292,307],[196,349],[1310,155],[1380,218],[1475,193],[1533,303],[1421,375],[1341,307],[1120,770],[1173,854],[1282,821],[1349,870],[1423,755]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3===0?2.3:1.4}/>)}</g>
      </svg>
      <div className={styles.vignette} aria-hidden="true" />

      <header className={styles.header}>
        <a className={styles.brand} href="#arrival" aria-label="Uzair Khurshid, return to arrival"><Emblem/><span>Uzair<br/>Khurshid</span></a>
        <span className={styles.edition}>A personal orbit <i/> Vol. 01</span>
        <nav aria-label="Main navigation"><a href="#atlas">The work</a><a href="#maker">The maker</a><a href="#signal">Say hello <span aria-hidden="true">↗</span></a></nav>
      </header>

      <aside className={styles.chapterNav} aria-label="Journey chapters">
        {[['arrival','Arrival'],['atlas','The atlas'],['maker','The maker'],['signal','A signal']].map(([id,label],i)=><a key={id} href={`#${id}`} aria-current={chapter===i?"step":undefined}><span className={styles.chapterDiamond}/><span className={styles.chapterLabel}>{label}</span><small>0{i+1}</small></a>)}
      </aside>

      <main id="main-content" className={styles.content}>
        <section id="arrival" className={styles.arrival} aria-labelledby="arrival-title">
          <div ref={hero} className={styles.heroInner}>
            <div className={styles.titleGroup}><p>Web developer · Curious by nature</p><h1 id="arrival-title">Uzair Khurshid</h1><span className={styles.titleRule}/><p className={styles.tagline}>A small world of things I’ve built.<br/>And things I’m still discovering.</p></div>
            <div className={styles.heroFoot}><p>Based on Earth.<br/><span>Open to the unexpected.</span></p><a href="#atlas" className={styles.scrollPrompt}><span>Begin the journey</span><i aria-hidden="true"/></a><p className={styles.dragHint}>{sceneState==="fallback"?"Still view · 3D unavailable":"The moon is yours to turn."}<br/><span>{sceneState==="fallback"?"Explore the chapters below":"Drag to explore · Scroll to approach"}</span></p></div>
          </div>
        </section>

        <section id="atlas" className={styles.atlas} aria-labelledby="atlas-title">
          <div className={styles.atlasInner}>
            <div className={styles.atlasHeading}><p className={styles.eyebrow}>01 / The atlas</p><h2 id="atlas-title">Every idea<br/>finds an <em>orbit.</em></h2><p>A few things I’ve sent into the world.<br/>Choose a constellation to explore.</p></div>
            <div className={styles.projectPicker} role="group" aria-label="Explore a project">{projects.map((p,i)=><button key={p.number} aria-pressed={selected===i} className={selected===i?styles.selectedStar:undefined} onClick={()=>setSelected(i)}><span className={styles.starGlyph}>{p.symbol}</span><span><small>0{i+1}</small>{p.name}</span></button>)}</div>
            <article className={`${styles.projectDetail} ${styles.glass}`} aria-labelledby="project-title">
              <div className={styles.projectContent} key={selected}>
              <div className={styles.projectTop}><span>{project.number} / Selected project</span><span>{project.scope}</span></div>
              <h3 id="project-title">{project.title}</h3><p>{project.description}</p><small className={styles.tools}>{project.tools}</small>
              <a className={styles.textLink} href={`mailto:stronghold.kingdom.777@gmail.com?subject=${encodeURIComponent(`Tell me about ${project.title}`)}`}>Ask me about this project <span aria-hidden="true">↗</span></a>
              </div>
            </article>
          </div>
        </section>

        <section id="maker" className={styles.maker} aria-labelledby="maker-title">
          <div className={styles.makerInner}><p className={styles.eyebrow}>02 / The maker</p><h2 id="maker-title">Led by curiosity.<br/><em>Grounded in craft.</em></h2><div className={styles.makerCopy}><p>I’m Uzair. I build web experiences and full-stack products—with a marketer’s eye and a developer’s discipline.</p><p>My path started with WordPress, search, and content. Building, growing, and selling an affiliate project taught me to see the whole journey. Now I bring that perspective to the things I make.</p><a className={styles.textLink} href="https://github.com/espresso-gg" target="_blank" rel="noreferrer">Explore my GitHub <span aria-hidden="true">↗</span></a></div><div className={styles.craftNotes}><span>Discover the reason.</span><span>Shape the experience.</span><span>Build with care.</span></div></div>
        </section>

        <section id="signal" className={styles.signal} aria-labelledby="signal-title">
          <div className={styles.signalInner}><Emblem className={styles.signalEmblem}/><p className={styles.eyebrow}>03 / A signal across the distance</p><h2 id="signal-title">Our paths<br/>might <em>cross.</em></h2><p>A project, an idea, or just a hello.<br/>There’s always room for another conversation.</p><a className={styles.contactLink} href="mailto:stronghold.kingdom.777@gmail.com">Send a signal <span aria-hidden="true">↗</span></a></div>
          <footer className={styles.footer}><span>© {new Date().getFullYear()} Uzair Khurshid</span><a href="https://github.com/espresso-gg" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://svs.gsfc.nasa.gov/4720/" target="_blank" rel="noreferrer">Lunar maps: NASA SVS</a><a href="#arrival">Return to the beginning ↑</a></footer>
        </section>
      </main>

      <div className={styles.observatoryControls} aria-label="Moon controls">
        <button className={`${styles.motionControl} ${styles.glass}`} onClick={()=>setPaused(!paused)} aria-pressed={paused} disabled={reduced} aria-label={paused?"Resume ambient motion":"Pause ambient motion"}>{reduced?"Stillness":paused?"Resume motion":"Pause motion"}<span aria-hidden="true">{paused?"▷":"Ⅱ"}</span></button>
        <div className={`${styles.moonDock} ${styles.glass}`}>
        <div className={styles.rotationControls}><button disabled={sceneState!=="ready"} onClick={()=>rotate(-1)} aria-label="Rotate moon left">←</button><span>Rotate</span><button disabled={sceneState!=="ready"} onClick={()=>rotate(1)} aria-label="Rotate moon right">→</button></div>
        <label className={styles.lightControl}><span>Moonlight</span><input aria-label="Moonlight direction" type="range" min="0" max="1" step=".01" value={light} disabled={sceneState!=="ready"} onPointerDown={e=>{e.preventDefault();e.currentTarget.focus();e.currentTarget.setPointerCapture(e.pointerId);pointLight(e);}} onPointerMove={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))pointLight(e);}} onPointerUp={e=>{if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}} onInput={e=>setLight(Number(e.currentTarget.value))} onChange={e=>setLight(Number(e.target.value))} onKeyDown={e=>{
          const values: Record<string, number> = { ArrowRight: light+.05, ArrowUp: light+.05, ArrowLeft: light-.05, ArrowDown: light-.05, Home: 0, End: 1 };
          if (e.key in values) { e.preventDefault(); setLight(Math.min(1,Math.max(0,values[e.key]))); }
        }}/></label>
        </div>
      </div>
      <p className={styles.srOnly} role="status">{sceneState==="fallback"?"Still view is active. All portfolio content remains available.":sceneState==="ready"?"Moon ready. Drag horizontally to rotate, or use the rotation buttons.":"Preparing the interactive moon. You can explore the portfolio now."}</p>
    </div>
  );
}
