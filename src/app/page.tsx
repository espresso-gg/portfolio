"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CursorCompanion from "@/components/cursor-companion";

const RoninArtifact = dynamic(() => import("@/components/core-scene"), {
  ssr: false,
});

const missions = [
  {
    no: "01",
    year: "2026",
    name: "Inventory Management System",
    discipline: "Full-stack / Operations",
    objective:
      "A command center for stock, sales, workflows, and daily business clarity.",
    stack: ["Next.js", "React", "Node", "MongoDB"],
    seal: "ACTIVE",
  },
  {
    no: "02",
    year: "2025",
    name: "Commerce Interface",
    discipline: "Frontend / UX",
    objective:
      "A sharp storefront experience shaped around discovery, speed, and trust.",
    stack: ["React", "Motion", "API", "UI Systems"],
    seal: "FIELD",
  },
  {
    no: "03",
    year: "2024",
    name: "Interactive Web Experiments",
    discipline: "Creative Development",
    objective:
      "Browser experiments where motion, layout, and interaction feel physical.",
    stack: ["GSAP", "Three.js", "Canvas", "Design"],
    seal: "LAB",
  },
];

const weapons = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "MongoDB",
  "Tailwind",
  "GSAP",
  "Three.js",
];

function NorthEast() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const scope = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const timer = window.setTimeout(() => setReady(true), 1050);

    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((item) => {
        gsap.fromTo(
          item,
          { yPercent: 115, rotate: 2 },
          {
            yPercent: 0,
            rotate: 0,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: { trigger: item, start: "top 92%" },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%" },
          },
        );
      });

      gsap.to(".brush-sky", {
        xPercent: -18,
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: ".ronin-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".katana", {
        xPercent: 18,
        rotate: -16,
        ease: "none",
        scrollTrigger: {
          trigger: ".ronin-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-artifact", {
        yPercent: 26,
        rotate: 4,
        ease: "none",
        scrollTrigger: {
          trigger: ".ronin-hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>(".seal").forEach((seal, index) => {
        gsap.fromTo(
          seal,
          { scale: 1.7, rotate: -18, opacity: 0 },
          {
            scale: 1,
            rotate: index % 2 ? 8 : -7,
            opacity: 1,
            duration: 0.75,
            ease: "back.out(2)",
            scrollTrigger: { trigger: seal, start: "top 86%" },
          },
        );
      });

      const media = gsap.matchMedia();
      media.add("(min-width: 821px)", () => {
        const track = document.querySelector<HTMLElement>(".mission-track");
        const progress = document.querySelector<HTMLElement>(".scroll-meter i");
        if (!track) return;

        const horizontal = gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: ".mission-stage",
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

        gsap.to(".ghost-kanji", {
          xPercent: -36,
          ease: "none",
          scrollTrigger: {
            trigger: ".mission-stage",
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            scrub: 1.25,
          },
        });

        gsap.utils.toArray<HTMLElement>(".scroll-card").forEach((card, index) => {
          gsap.fromTo(
            card,
            { xPercent: index % 2 ? 34 : -24, yPercent: index % 2 ? -10 : 14 },
            {
              xPercent: index % 2 ? -18 : 18,
              yPercent: index % 2 ? 12 : -10,
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
    <div ref={scope} className="ronin-folio">
      <CursorCompanion />

      <div className={`preloader ${ready ? "preloader--done" : ""}`} aria-hidden="true">
        <span>UZAIR</span>
        <div className="preloader__slash" />
        <p>Opening mission archive</p>
      </div>

      <header className="ronin-nav">
        <a href="#top" className="ronin-mark">
          UZ<span>浪</span>
        </a>
        <nav>
          <a href="#missions">Missions</a>
          <a href="#weapons">Weapons</a>
          <a href="#contact">Contact</a>
        </nav>
        <p><i /> Available / Remote</p>
      </header>

      <main>
        <section className="ronin-hero" id="top">
          <div className="paper-noise" aria-hidden="true" />
          <div className="shoji" aria-hidden="true" />
          <div className="brush-sky" aria-hidden="true" />
          <div className="sun-seal" aria-hidden="true" />
          <div className="katana" aria-hidden="true"><i /></div>

          <div className="hero-artifact" aria-hidden="true">
            <RoninArtifact />
          </div>

          <div className="hero-meta hero-meta--left">
            <span>Code Ronin</span>
            <b>Frontend / Full-stack / Motion</b>
          </div>
          <div className="hero-meta hero-meta--right">
            <span>Field log</span>
            <b>Years of web work, sharpened into one archive.</b>
          </div>

          <h1 className="ronin-title">
            <span className="title-row title-row--small">The</span>
            <span className="title-row">UZAIR</span>
            <span className="title-row title-row--split">
              <b>CODE</b>
              <em>RONIN</em>
            </span>
          </h1>

          <p className="hero-copy">
            I build web interfaces with discipline, atmosphere, and motion —
            polished systems that feel alive in the browser.
          </p>

          <a href="#missions" className="scroll-ritual">
            <span>Scroll to unsheathe</span>
            <b>↓</b>
          </a>
        </section>

        <section className="manifesto">
          <div className="section-kicker">
            <span>壱 / Manifesto</span>
            <p>Old paper, modern code, sharp intent.</p>
          </div>

          <div className="manifesto__copy">
            <div className="line-mask"><p data-rise>I don&apos;t want the portfolio</p></div>
            <div className="line-mask"><p data-rise>to just show the work.</p></div>
            <div className="line-mask"><p data-rise><em>It should perform it.</em></p></div>
          </div>

          <div className="manifesto__grid">
            <article data-fade>
              <span>01</span>
              <h2>Craft</h2>
              <p>Every section should feel deliberate: texture, spacing, motion, and story aligned.</p>
            </article>
            <article data-fade>
              <span>02</span>
              <h2>Impact</h2>
              <p>Big typography and cinematic transitions make the first impression land fast.</p>
            </article>
            <article data-fade>
              <span>03</span>
              <h2>Interaction</h2>
              <p>The site reacts to cursor, scroll, hover, and idle states like a living interface.</p>
            </article>
          </div>
        </section>

        <section className="mission-archive" id="missions">
          <div className="archive-head">
            <div className="section-kicker">
              <span>弐 / Mission Archive</span>
              <p>Selected work as field scrolls.</p>
            </div>
            <h2>
              <span>Mission</span>
              <span>Scrolls</span>
            </h2>
          </div>

          <div className="mission-stage">
            <div className="ghost-kanji" aria-hidden="true">侍 / 侍 / 侍 / 侍</div>
            <div className="stage-labels">
              <span>Vertical input</span>
              <span>Horizontal archive →</span>
            </div>
            <div className="scroll-meter"><i /></div>

            <div className="mission-track">
              {missions.map((mission) => (
                <article className="mission" data-project={mission.no} key={mission.no}>
                  <div className="mission__tab">MISSION {mission.no}</div>
                  <div className="mission__paper">
                    <div className="seal">{mission.seal}</div>
                    <div className="mission__meta">
                      <span>{mission.year}</span>
                      <span>{mission.discipline}</span>
                    </div>
                    <div className="mission__body">
                      <div>
                        <p>Objective</p>
                        <h3>{mission.name}</h3>
                      </div>
                      <p>{mission.objective}</p>
                    </div>
                    <div className="mission__stack">
                      {mission.stack.map((item) => <span key={item}>{item}</span>)}
                    </div>
                    <button aria-label={`View ${mission.name}`}>
                      View case file <NorthEast />
                    </button>
                  </div>
                  <div className="scroll-card" aria-hidden="true">
                    <span>{mission.no}</span>
                    <b>UZ / FIELD PROOF</b>
                    <i />
                  </div>
                </article>
              ))}

              <aside className="archive-outro">
                <span>Archive end / continue</span>
                <p>More proof<br />belongs in<br /><em>case files.</em></p>
                <a href="#weapons">Enter the dojo <b>↓</b></a>
              </aside>
            </div>
          </div>
        </section>

        <section className="weapons" id="weapons">
          <div className="section-kicker">
            <span>参 / Weapons</span>
            <p>Tools of the build.</p>
          </div>
          <div className="weapon-grid">
            {weapons.map((weapon, index) => (
              <div className="weapon" data-fade key={weapon}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{weapon}</b>
                <i />
              </div>
            ))}
          </div>
        </section>

        <section className="contact-dojo" id="contact">
          <div className="contact-scroll">
            <span>Final scroll</span>
            <p>Have a mission?</p>
            <a href="mailto:stronghold.kingdom.777@gmail.com">
              <b>Send the scroll</b>
              <NorthEast />
            </a>
          </div>
          <footer>
            <span>©2026 Uzair</span>
            <a href="https://github.com/espresso-gg" target="_blank" rel="noreferrer">GitHub</a>
            <a href="mailto:stronghold.kingdom.777@gmail.com">Email</a>
          </footer>
        </section>
      </main>
    </div>
  );
}
