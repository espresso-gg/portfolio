"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef } from "react";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => value * value * (3 - 2 * value);

const projects = [
  {
    index: "01",
    title: "Inventory Management System",
    type: "Business operations platform",
    year: "2026",
    image: "/lunar-surface-destination.png",
    summary: "Stock, customers, staff, and financial visibility for Pakistan’s solar market.",
    stack: "Next.js · TypeScript · Node.js · MongoDB",
  },
  {
    index: "02",
    title: "Job Application Tracker",
    type: "Focused workflow product",
    year: "2026",
    image: "/lunar-hero-bg.png",
    summary: "A deliberate system for applications, follow-ups, status, and review.",
    stack: "React · Node.js · MongoDB",
  },
  {
    index: "03",
    title: "Headphones Affiliate Project",
    type: "Built, grown, and sold",
    year: "Archive",
    image: "/lunar-gemini-hero.png",
    summary: "A complete commercial loop—from search intent and content to monetization and exit.",
    stack: "WordPress · SEO · Content strategy",
  },
];

const practice = [
  ["01", "Find the signal", "Clarify the commercial problem, the user, and what success needs to mean before touching the interface."],
  ["02", "Shape the journey", "Turn information into hierarchy, interaction, and a visual system with a reason for every decision."],
  ["03", "Build the system", "Engineer the product, test the edges, protect performance, and prepare it for real use."],
];

export function PortfolioChapters() {
  const rootRef = useRef<HTMLDivElement>(null);

  const updateChapters = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const viewport = window.innerHeight;
    root.querySelectorAll<HTMLElement>("[data-scroll-scene]").forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      const distance = Math.max(scene.offsetHeight - viewport, 1);
      const progress = ease(clamp01(-rect.top / distance));
      scene.style.setProperty("--scene-progress", progress.toFixed(4));

      if (scene.dataset.scrollScene === "process") {
        scene.style.setProperty("--card-one", ease(clamp01(progress / .34)).toFixed(4));
        scene.style.setProperty("--card-two", ease(clamp01((progress - .28) / .34)).toFixed(4));
        scene.style.setProperty("--card-three", ease(clamp01((progress - .6) / .34)).toFixed(4));
      }
    });
  }, []);

  useLenis(updateChapters, [updateChapters]);

  useEffect(() => {
    updateChapters();
    const handlePointerMove = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;
      root.style.setProperty("--manifesto-x", ((event.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
      root.style.setProperty("--manifesto-y", ((event.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
    };
    window.addEventListener("resize", updateChapters);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("resize", updateChapters);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [updateChapters]);

  return (
    <div ref={rootRef} className="portfolio-chapters">
      <section className="lunar-manifesto" data-scroll-scene="manifesto" aria-labelledby="manifesto-title">
        <div className="manifesto-horizon" aria-hidden="true" />
        <div className="manifesto-sticky">
          <header className="manifesto-folio">
            <p className="chapter-kicker">Practice / Thesis</p>
            <span>01 — A wider field of view</span>
          </header>

          <div className="manifesto-statement">
            <h2 id="manifesto-title" className="manifesto-title">
              <span>Attention before <em className="font-accent">interface.</em></span>
              <span>Context before <em className="font-accent">code.</em></span>
            </h2>
            <div className="manifesto-aperture" aria-hidden="true"><i /></div>
          </div>

          <footer className="manifesto-foot">
            <p className="manifesto-body">
              I came to development through search, content, and small businesses. That perspective
              still guides the work: understand why people arrive, then build what makes them stay.
            </p>
            <p className="manifesto-method"><span>Read the signal</span><span>Shape the journey</span><span>Build the system</span></p>
          </footer>
        </div>
      </section>

      <section className="origin-sequence" id="story" data-scroll-scene="story" aria-labelledby="story-title">
        <div className="origin-ledger">
          <div className="origin-ledger__title">
            <p className="chapter-kicker">Origin / Proof / Practice</p>
            <h2 id="story-title">From search<br />to <em className="font-accent">systems.</em></h2>
          </div>
          <ol className="origin-ledger__beats">
            <li><b>01</b><h3>The web meets attention</h3><p>WordPress, Google SEO, and content taught me that useful work must first be readable and findable.</p></li>
            <li><b>02</b><h3>A complete commercial loop</h3><p>I built, grew, monetized, and sold an affiliate project—learning the whole lifecycle rather than one isolated craft.</p></li>
            <li><b>03</b><h3>Products with working depth</h3><p>Now I combine that market context with React, Next.js, Node.js, MongoDB, and production-minded systems.</p></li>
          </ol>
        </div>
      </section>

      <section className="work-archive" id="work" aria-labelledby="work-title">
        <div className="work-archive__head">
          <p className="chapter-kicker">Selected coordinates</p>
          <h2 id="work-title">Work with<br />a reason to <em className="font-accent">exist.</em></h2>
          <p>Three projects. Different surfaces. The same concern for clarity, utility, and outcomes.</p>
        </div>
        <div className="project-camera-track" data-scroll-scene="work">
          <div className="project-camera">
            <div className="project-orbit">
              {projects.map((project) => (
                <article className="project-card" key={project.title}>
                  <div className="project-card__visual">
                    <Image src={project.image} alt="" fill sizes="(max-width: 720px) 100vw, 72vw" />
                    <span>{project.index}</span>
                  </div>
                  <div className="project-card__meta"><span>{project.type}</span><span>{project.year}</span></div>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <small>{project.stack}</small>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="practice-sequence" id="process" data-scroll-scene="process" aria-labelledby="process-title">
        <div className="practice-field">
          <div className="practice-field__intro">
            <p className="chapter-kicker">How I work</p>
            <h2 id="process-title">From a loose idea to a <em className="font-accent">dependable release.</em></h2>
            <p>Atmosphere matters. So do maintainability, loading time, accessibility, and the unglamorous details that make a product hold together.</p>
          </div>
          <div className="practice-cards">
            {practice.map(([index, title, body]) => (
              <article key={index}>
                <b>{index}</b><h3>{title}</h3><p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="capability-sequence" data-scroll-scene="capabilities" aria-labelledby="capability-title">
        <div className="capability-orbits">
          <div className="capability-orbits__line capability-orbits__line--top" aria-hidden="true" />
          <p className="chapter-kicker">The working constellation</p>
          <h2 id="capability-title">Strategy · <em className="font-accent">Interface</em> · Engineering</h2>
          <p>React / Next.js / TypeScript / Node.js / MongoDB / WordPress / SEO / Content</p>
          <div className="capability-orbits__line capability-orbits__line--bottom" aria-hidden="true" />
        </div>
      </section>

      <footer className="lunar-footer" id="contact">
        <div className="lunar-footer__top">
          <p className="chapter-kicker">A new orbit starts here</p>
          <a href="mailto:stronghold.kingdom.777@gmail.com">Let’s build something worth <em className="font-accent">remembering</em> <span aria-hidden="true">↗</span></a>
        </div>
        <div className="lunar-footer__links">
          <a href="https://github.com/espresso-gg" target="_blank" rel="noreferrer">GitHub ↗</a>
          <a href="mailto:stronghold.kingdom.777@gmail.com">Email ↗</a>
          <span>Pakistan / Available worldwide</span>
        </div>
        <p className="lunar-footer__name">Uzair Khurshid</p>
        <small>© {new Date().getFullYear()} Uzair Khurshid</small>
      </footer>
    </div>
  );
}
