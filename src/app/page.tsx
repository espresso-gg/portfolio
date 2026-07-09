"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const EditorialObject = dynamic(() => import("@/components/core-scene"), {
  ssr: false,
});

const projects = [
  {
    no: "01",
    year: "2024",
    name: "Digital Commerce",
    discipline: "Design / Development",
    description: "A conversion-led commerce experience built around discovery, speed, and a frictionless path to purchase.",
    tone: "coral",
  },
  {
    no: "02",
    year: "2023",
    name: "Operations Engine",
    discipline: "Product / Full Stack",
    description: "Complex business operations shaped into a direct, visual system for faster everyday decisions.",
    tone: "ink",
  },
  {
    no: "03",
    year: "2022",
    name: "Interactive Worlds",
    discipline: "Creative Development",
    description: "Experiments where interface, motion, and code work together to make the browser feel physical.",
    tone: "acid",
  },
];

function NorthEast() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const scope = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const timer = window.setTimeout(() => setReady(true), 850);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((item) => {
        gsap.fromTo(
          item,
          { yPercent: 105 },
          {
            yPercent: 0,
            duration: 1.15,
            ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 92%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 90%" },
          },
        );
      });

      gsap.to(".hero-object", {
        yPercent: 28,
        rotate: 6,
        ease: "none",
        scrollTrigger: {
          trigger: ".editorial-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      const media = gsap.matchMedia();
      media.add("(min-width: 761px)", () => {
        const track = document.querySelector<HTMLElement>(".horizontal-track");
        const progress = document.querySelector<HTMLElement>(".axis-progress i");
        if (!track) return;

        const horizontal = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: ".horizontal-stage",
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (progress) progress.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        gsap.to(".axis-word", {
          xPercent: -42,
          ease: "none",
          scrollTrigger: {
            trigger: ".horizontal-stage",
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1.4,
          },
        });

        gsap.utils.toArray<HTMLElement>(".visual-card").forEach((card, index) => {
          gsap.fromTo(
            card,
            { xPercent: index % 2 ? 35 : -30, yPercent: index % 2 ? -12 : 16 },
            {
              xPercent: index % 2 ? -20 : 22,
              yPercent: index % 2 ? 15 : -12,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: horizontal,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        return () => {
          horizontal.scrollTrigger?.kill();
          horizontal.kill();
        };
      });

      return () => media.revert();
    }, scope);

    return () => {
      window.clearTimeout(timer);
      context.revert();
    };
  }, []);

  return (
    <div ref={scope} className="folio">
      <div className={`intro ${ready ? "intro--out" : ""}`} aria-hidden="true">
        <div className="intro__counter">©26</div>
        <div className="intro__bar"><i /></div>
        <span>Loading index</span>
      </div>

      <header className="topbar">
        <a href="#top" className="wordmark">UZAIR<span>®</span></a>
        <nav>
          <a href="#profile">Profile</a>
          <a href="#work">Index</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="topbar__status"><i /> Available / 2026</div>
      </header>

      <main>
        <section className="editorial-hero" id="top">
          <div className="hero-grid" aria-hidden="true">
            <i /><i /><i /><i />
          </div>

          <div className="hero-object" aria-hidden="true">
            <EditorialObject />
          </div>

          <div className="hero-label hero-label--one">Issue 01 / Folio</div>
          <div className="hero-label hero-label--two">Full-stack + Motion</div>
          <div className="hero-label hero-label--three">Karachi, Pakistan</div>

          <h1 className="masthead">
            <span className="masthead__line"><b>©26</b><strong>UZAIR</strong></span>
            <span className="masthead__line masthead__line--shift"><strong>FULL-STACK</strong></span>
            <span className="masthead__line"><strong>DEVELOPER</strong></span>
            <span className="masthead__line masthead__line--last">
              <strong>WITH</strong><em>(MOTION)</em>
            </span>
          </h1>

          <div className="hero-stamp">
            <span>Scroll to explore</span>
            <b>↓</b>
          </div>
          <div className="hero-note">
            Digital products, expressive interfaces<br />
            and systems built to last.
          </div>
        </section>

        <section className="profile" id="profile">
          <div className="rail-title">
            <span>01</span>
            <p>Profile / Approach</p>
          </div>

          <div className="profile__copy">
            <div className="line-mask"><p data-rise>I design and develop</p></div>
            <div className="line-mask"><p data-rise>digital work that is</p></div>
            <div className="line-mask"><p data-rise><em>useful, unusual,</em></p></div>
            <div className="line-mask"><p data-rise>and impossible to ignore.</p></div>
          </div>

          <div className="profile__foot">
            <div className="profile__portrait" data-fade>
              <div className="portrait-code">UZ<br />/26</div>
              <span>Portrait pending</span>
            </div>
            <p data-fade>
              I work across design and engineering, moving from early concepts
              to production code. The goal is always the same: clarity,
              character, and an experience that earns attention.
            </p>
            <ul data-fade>
              <li>Creative frontend</li>
              <li>Full-stack architecture</li>
              <li>Interaction systems</li>
              <li>3D web experiences</li>
            </ul>
          </div>
        </section>

        <section className="work-index" id="work">
          <div className="index-head">
            <div className="rail-title">
              <span>02</span>
              <p>Selected Work / 22—26</p>
            </div>
            <h2>
              <span>Project</span>
              <span>Index</span>
            </h2>
            <p>Three selected stories from years of designing and building for the web.</p>
          </div>

          <div className="horizontal-stage">
            <div className="axis-word" aria-hidden="true">Selected / Selected / Selected</div>
            <div className="axis-ui">
              <span>Vertical input</span>
              <span>Horizontal output →</span>
            </div>
            <div className="axis-progress"><i /></div>
            <div className="horizontal-track">
              {projects.map((project) => (
                <article className={`project project--${project.tone}`} key={project.no}>
                  <div className="project__topline">
                    <span>{project.no} / 03</span>
                    <span>{project.discipline}</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="project__visual" aria-hidden="true">
                    <div className="visual-grid" />
                    <div className="visual-card">
                      <span>{project.no}</span>
                      <b>UZ / SELECTED</b>
                    </div>
                    <div className="visual-orbit" />
                  </div>
                  <div className="project__body">
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <button aria-label={`Open ${project.name}`}>
                      View case study <NorthEast />
                    </button>
                  </div>
                </article>
              ))}
              <aside className="axis-outro">
                <span>End of index / 03</span>
                <p>Different<br />directions.<br /><em>One intent.</em></p>
                <a href="#contact">Continue vertically <b>↓</b></a>
              </aside>
            </div>
          </div>
        </section>

        <section className="ticker" aria-hidden="true">
          <div>
            <span>Design</span><i>+</i><span>Code</span><i>+</i><span>Motion</span><i>+</i>
            <span>Design</span><i>+</i><span>Code</span><i>+</i><span>Motion</span><i>+</i>
          </div>
        </section>

        <section className="contact-sheet" id="contact">
          <div className="contact-sheet__meta">
            <span>03 / Contact</span>
            <span>Open for selected work</span>
            <span>PKT / GMT+5</span>
          </div>
          <p>Have a project in mind?</p>
          <a href="mailto:stronghold.kingdom.777@gmail.com">
            <span>LET&apos;S</span>
            <span>MAKE IT</span>
            <em>REAL.</em>
            <NorthEast />
          </a>
          <footer>
            <span>©2026 Uzair</span>
            <div>
              <a href="https://github.com/espresso-gg" target="_blank" rel="noreferrer">GitHub</a>
              <a href="mailto:stronghold.kingdom.777@gmail.com">Email</a>
            </div>
            <span>Built from scratch</span>
          </footer>
        </section>
      </main>
    </div>
  );
}
