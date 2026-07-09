"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const CoreScene = dynamic(() => import("@/components/core-scene"), {
  ssr: false,
  loading: () => <div className="scene-fallback" />,
});

const projects = [
  {
    index: "01",
    year: "2024",
    title: "Digital Commerce",
    type: "Full-stack experience",
    copy: "A fast, conversion-led storefront shaped around product discovery, clean systems, and frictionless interaction.",
    color: "#ff9a3c",
  },
  {
    index: "02",
    year: "2023",
    title: "Operations Engine",
    type: "Platform architecture",
    copy: "A complex management workflow distilled into a focused interface that turns noisy data into clear decisions.",
    color: "#9fffd8",
  },
  {
    index: "03",
    year: "2022",
    title: "Interactive Worlds",
    type: "Creative development",
    copy: "Experimental web work where motion, code, and visual storytelling meet to make the browser feel physical.",
    color: "#b3b8ff",
  },
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "↓"}</span>;
}

export default function Home() {
  const root = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const loaderTimer = window.setTimeout(() => setLoaded(true), 1200);
    const updateTime = () =>
      setTime(
        new Intl.DateTimeFormat("en", {
          timeZone: "Asia/Karachi",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    updateTime();
    const clock = window.setInterval(updateTime, 30_000);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: element, start: "top 88%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".project-row").forEach((row) => {
        gsap.fromTo(
          row,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: { trigger: row, start: "top 90%" },
          },
        );
      });
    }, root);

    return () => {
      window.clearTimeout(loaderTimer);
      window.clearInterval(clock);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className="site-shell">
      <div className={`loader ${loaded ? "loader--done" : ""}`} aria-hidden="true">
        <div className="loader__mark">U/Z</div>
        <div className="loader__line"><span /></div>
        <p>Establishing signal</p>
      </div>

      <div className="grain" aria-hidden="true" />
      <div className="canvas-wrap" aria-hidden="true">
        <CoreScene />
      </div>

      <header className="site-nav">
        <a className="monogram" href="#top" aria-label="Back to top">U/Z</a>
        <nav aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="availability"><span /> Available for work</div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero__eyebrow">
            <span>Creative developer</span>
            <span>Karachi · PK {time}</span>
          </div>
          <div className="hero__title" aria-label="I engineer digital worlds">
            <div className="title-line title-line--one"><span>I engineer</span></div>
            <div className="title-line title-line--two"><span>digital worlds.</span></div>
          </div>
          <div className="hero__footer">
            <p>
              Full-stack developer crafting high-impact digital experiences
              where technology, motion, and purpose converge.
            </p>
            <a href="#work" className="scroll-cue">
              <span>Enter the archive</span>
              <Arrow />
            </a>
          </div>
          <div className="hero__coordinates">24.8607° N<br />67.0011° E</div>
          <div className="hero__chapter">CH / 001</div>
        </section>

        <section className="manifesto" id="about">
          <div className="section-kicker" data-reveal>
            <span>01</span>
            <span>What I do</span>
          </div>
          <p className="manifesto__statement" data-reveal>
            I turn ambitious ideas into{" "}
            <em>digital experiences</em> that feel inevitable.
          </p>
          <div className="manifesto__details">
            <p data-reveal>
              From systems that run businesses to interfaces that stop a
              scroll, I work across the full stack to make the complex feel
              beautifully simple.
            </p>
            <div className="capabilities" data-reveal>
              <span>Creative direction</span>
              <span>Frontend engineering</span>
              <span>Full-stack systems</span>
              <span>Motion &amp; interaction</span>
            </div>
          </div>
        </section>

        <section className="work" id="work">
          <div className="work__heading">
            <div className="section-kicker" data-reveal>
              <span>02</span>
              <span>Selected transmissions</span>
            </div>
            <h2 data-reveal>Work across<br />the years.</h2>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article
                className="project-row"
                key={project.index}
                style={{ "--project-color": project.color } as React.CSSProperties}
              >
                <div className="project-row__meta">
                  <span>{project.index}</span>
                  <span>{project.year}</span>
                </div>
                <div className="project-row__main">
                  <p>{project.type}</p>
                  <h3>{project.title}</h3>
                  <p className="project-row__copy">{project.copy}</p>
                </div>
                <button className="project-row__button" aria-label={`Explore ${project.title}`}>
                  <Arrow diagonal />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="interlude">
          <p data-reveal>Built to move.</p>
          <div className="marquee" aria-hidden="true">
            <div>
              <span>Code</span><i>✦</i><span>Motion</span><i>✦</i>
              <span>Systems</span><i>✦</i><span>Ideas</span><i>✦</i>
              <span>Code</span><i>✦</i><span>Motion</span><i>✦</i>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="section-kicker" data-reveal>
            <span>03</span>
            <span>Open channel</span>
          </div>
          <p className="contact__pre" data-reveal>Have something impossible in mind?</p>
          <a
            className="contact__link"
            href="mailto:stronghold.kingdom.777@gmail.com"
            data-reveal
          >
            Let&apos;s make it real.<Arrow diagonal />
          </a>
          <footer>
            <span>© {new Date().getFullYear()} Uzair</span>
            <div>
              <a href="https://github.com/espresso-gg" target="_blank" rel="noreferrer">GitHub</a>
              <a href="mailto:stronghold.kingdom.777@gmail.com">Email</a>
            </div>
            <span>Designed in code</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
