"use client";

import { useEffect, useState } from "react";

const A = "https://zainabkabira.com/assets/";

const projects = [
  { title: "Hatcha", subtitle: "The generative UI system that shipped to Google I/O 2026.", image: `${A}genUI%20case%20study%20assets/hero%20asset/hero-plate.jpg`, className: "hatcha" },
  { title: "Fireflut", subtitle: "Google Gemini's telecom AI showcase, live on the MWC 2025 floor.", image: `${A}fireflut/mwc-hero-plate.jpg`, className: "fireflut" },
  { title: "Existence", subtitle: "Rob Dyrdek's time-intelligence app, 8,000+ in beta with 30,000 waiting.", image: `${A}existence%20case%20study%20assets/hero%20asset/hero-plate.jpg`, className: "existence" },
  { title: "Jumpable", subtitle: "A jump lab on your ankle. The redesign that doubled paid conversion.", image: `${A}Jumpable%20case%20study%20assets/hero%20asset/hero-plate.jpg`, className: "jumpable" },
];

const testimonials = [
  { quote: "Zainab is a detailed and analytical designer with a true eagerness to learn and discover new opportunities. Her core strengths lie in her exceptional technical skills and ability to embrace new technologies for building great products. Zainab is a proactive and reliable collaborator who excels at communicating with developers, stakeholders, and her fellow designers. Zainab has been a fantastic member of our team, and I am certain she has a bright future ahead as she continues her professional journey.", name: "Jared Bell", role: "Creative director at gskinner", image: `${A}t-jared-bell.jpeg` },
  { quote: "Zainab is a very good designer to work with on daily basis. She has a deep care for human-centered design, which makes her design easier for end users to understand. While working with us she made sure, she took care of complex interactions and state management, which helped us to scale the projects very well.", name: "Roopam Mishra", role: "Founder at Phionike", image: `${A}t-roopam-mishra.jpeg` },
  { quote: "Her work truly speaks for itself: it’s research backed, resilient against edge cases, and built with a beautiful aesthetic that is delightful to interact with. Zainab’s confidence and attention to detail make even the most complex challenges feel manageable. Whether vibe-coding or constructing 3D environments, she’s natural at tackling new tools and concepts with total fearlessness – an asset to any team!", name: "Anna Groat", role: "Product designer at gskinner", image: `${A}t-anna-groat.jpeg` },
];

function Menu({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) {
  return <div className={`menu-overlay ${open ? "is-open" : ""}`} onClick={() => setOpen(false)}>
    <div className="menu-sheet" onClick={(e) => e.stopPropagation()}>
      <div className="menu-top"><span>VANCOUVER, BC</span><button onClick={() => setOpen(false)}>×</button></div>
      <a href="#work" onClick={() => setOpen(false)}>01 <span>Work</span></a>
      <a href="#about" onClick={() => setOpen(false)}>02 <span>About</span></a>
      <a href="#playground" onClick={() => setOpen(false)}>03 <span>Playground</span></a>
    </div>
  </div>;
}

export function PortfolioExperience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => typeof window !== "undefined" && localStorage.getItem("theme") === "night");
  const [playing, setPlaying] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      document.documentElement.style.setProperty("--mx", `${x}`);
      document.documentElement.style.setProperty("--my", `${y}`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    const cursor = document.createElement("div");
    cursor.className = "dot-cursor";
    cursor.innerHTML = "<span>Press play, stranger</span>";
    document.body.appendChild(cursor);
    const moveCursor = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.classList.add("is-visible");
      const hot = event.target instanceof Element && event.target.closest("a,button");
      const reel = event.target instanceof Element && event.target.closest(".cassette");
      cursor.classList.toggle("is-hot", Boolean(hot) && !reel);
      cursor.classList.toggle("is-reel", Boolean(reel));
    };
    const down = () => cursor.classList.add("is-down");
    const up = () => cursor.classList.remove("is-down");
    const scroll = () => document.querySelector(".topbar")?.classList.toggle("scrolled", window.scrollY > window.innerHeight - 320);
    window.addEventListener("pointermove", moveCursor, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointermove", moveCursor); window.removeEventListener("pointerdown", down); window.removeEventListener("pointerup", up); window.removeEventListener("scroll", scroll); cursor.remove(); };
  }, []);

  useEffect(() => { localStorage.setItem("theme", dark ? "night" : "day"); }, [dark]);

  return <main className={`z-site ${dark ? "night" : ""}`}>
    <Menu open={menuOpen} setOpen={setMenuOpen} />
    <header className="topbar">
      <div className="location"><span>⌾</span> VANCOUVER, BC</div>
      <button className="circle-button menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}><span /><span /><span /></button>
      <nav className="desktop-nav"><img src={`${A}imgProfilePicture.jpg`} alt="" /><a href="#work">Work</a><a href="#about">About</a><a href="#playground">Playground</a><button className="nav-contact" onClick={() => setContactOpen(true)}>✉ &nbsp; Work with me</button></nav>
      <div className="top-actions"><button className={`circle-button wave-button ${playing ? "playing" : ""}`} onClick={() => setPlaying(!playing)} aria-label="Play music"><span>〰</span></button><button className="circle-button theme-button" aria-label="Toggle day / night theme" onClick={() => setDark(!dark)}><span>☼</span></button></div>
    </header>

    <section className="hero" id="top">
      <div className="hero-sky" /><img className="sun" src={`${A}sun.svg`} alt="" /><img className="cloud cloud-one" src={`${A}cloud.svg`} alt="" /><img className="cloud cloud-two" src={`${A}cloud.svg`} alt="" /><img className="moon" src={`${A}moon.svg`} alt="" /><div className="hero-noise" />
      <div className="side-label">DESIGN / DETAILS / CODE</div>
      <div className="hero-copy"><p className="eyebrow"><i /> HELLO, I’M ZAINAB KABIRA. A –</p><h1><span>Designer who</span><span className="scramble">Builds</span></h1><button className={`cassette ${playing ? "playing" : ""}`} onClick={() => setPlaying(!playing)} aria-label="Play my design journey"><span className="cassette-label">My design journey, rapped</span><div className="cassette-slider"><i /></div><small className="cassette-time">{playing ? "0:14" : "0:00"}<b>2:00</b></small><span className="reel reel-left" /><span className="reel reel-right" /><span className="play-icon">{playing ? "Ⅱ" : "▶"}</span></button></div>
      <div className="hero-wave" />
    </section>

    <section className="intro" id="about"><p>Six years across architecture and product design, designing what’s next – from India’s first carbon-positive modular home to shipping AI experiences with gskinner, brought to the world at Google I/O ’26 and MWC Barcelona ’25.</p><p>I believe every great design forms the basis for an even greater story and I’m here to keep writing mine.</p></section>

    <section className="featured" id="work"><div className="section-title"><span>Work featured on</span><div className="logo-row"><img src={`${A}logo-existence.svg`} alt="Existence" /><img src={`${A}logo-google.svg`} alt="Google" /><img src={`${A}logo-pga.png`} alt="PGA Tour" /><img src={`${A}logo-jumpable.png`} alt="Jumpable" /><img src={`${A}logo-vibes.png`} alt="Vibes+Logic" /></div></div><div className="project-grid">{projects.map((project, i) => <a className={`project ${project.className}`} href="#contact" key={project.title}><img src={project.image} alt="" /><div className="project-shade" /><div className="project-copy"><strong>0{i + 1}</strong><h3>{project.title}</h3><p>{project.subtitle}</p><span>↗</span></div></a>)}</div></section>

    <section className="testimonials" id="playground"><div className="testimonials-land" /><div className="testimonial-heading"><span>TESTIMONIALS</span><h2>In their words</h2></div><div className="testimonial-card"><div className="quote-mark">“</div><p>{testimonials[activeTestimonial].quote}</p><div className="person"><img src={testimonials[activeTestimonial].image} alt={testimonials[activeTestimonial].name} /><div><strong>{testimonials[activeTestimonial].name}</strong><small>{testimonials[activeTestimonial].role}</small></div></div></div><div className="testimonial-controls"><button onClick={() => setActiveTestimonial((activeTestimonial + testimonials.length - 1) % testimonials.length)}>‹</button><span>{String(activeTestimonial + 1).padStart(2, "0")} / 03</span><button onClick={() => setActiveTestimonial((activeTestimonial + 1) % testimonials.length)}>›</button></div></section>

    <section className="contact" id="contact"><p>From early concepts to refined experiences, I help ambitious teams build products that earn trust, move quickly, and drive growth.</p><h2>Let’s grow your<br /><em>next idea.</em></h2><button onClick={() => setContactOpen(true)}>Let’s grow your next idea <span>↗</span></button></section>
    <div className={`contact-drawer ${contactOpen ? "is-open" : ""}`}><button className="drawer-close" onClick={() => setContactOpen(false)} aria-label="Close contact panel">×</button><p>AVAILABLE FOR NEW PROJECTS</p><h3>Grow together?</h3><p>Tell me what you're growing — a product, a brand, a wild idea. I'll write back within 48 hours.</p><a href="mailto:zainabvkabira@gmail.com">zainabvkabira@gmail.com ↗</a></div>
    <footer><span>Designed by Zainab Kabira · Vancouver, Canada @2026</span><div><a href="https://linkedin.com/in/zainabkabira/">LinkedIn</a><a href="https://github.com/Zainabvkabira">GitHub</a><a href="https://behance.net/zainab_kabira">Behance</a></div></footer>
  </main>;
}
