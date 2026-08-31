"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef } from "react";

const projects = [
  { title: "Inventory Management System", type: "Business operations platform", year: "2026", image: "/lunar-surface-destination-1920.webp", summary: "Stock, customers, staff, and financial visibility for Pakistan’s solar market.", stack: "Next.js · TypeScript · Node.js · MongoDB", scope: ["Inventory", "Customers & staff", "Financial visibility"] },
  { title: "Job Application Tracker", type: "Focused workflow product", year: "2026", image: "/lunar-hero-bg-1920.webp", summary: "A deliberate system for applications, follow-ups, status, and review.", stack: "React · Node.js · MongoDB", scope: ["Applications", "Follow-ups", "Status & review"] },
  { title: "Headphones Affiliate Project", type: "Built, grown, and sold", year: "Archive", image: "/lunar-gemini-hero-1920.webp", summary: "A complete commercial loop—from search intent and content to monetization and exit.", stack: "WordPress · SEO · Content strategy", scope: ["Search intent", "Content", "Monetization"] },
];

const practice = [
  ["01", "Find the signal", "Clarify the commercial problem, the user, and what success needs to mean before touching the interface."],
  ["02", "Shape the journey", "Turn information into hierarchy, interaction, and a visual system with a reason for every decision."],
  ["03", "Build the system", "Engineer the product, test the edges, protect performance, and prepare it for real use."],
];

export function PortfolioChapters() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const geometry = useRef({ top: 0, distance: 1, travel: 0 });
  const lenis = useLenis();

  const update = useCallback((scroll: number) => {
    const { top, distance, travel } = geometry.current;
    const progress = Math.min(1, Math.max(0, (scroll - top) / distance));
    // Geometry is cached on resize; scrolling only updates transforms.
    railRef.current?.style.setProperty("--rail-x", `${-progress * travel}px`);
    rootRef.current?.style.setProperty("--work-progress", String(progress));
    rootRef.current?.querySelectorAll<HTMLButtonElement>(".project-controls button").forEach((button, index) => {
      const current = index === Math.round(progress * (projects.length - 1)) ? "true" : "false";
      if (button.getAttribute("aria-current") !== current) button.setAttribute("aria-current", current);
    });
  }, []);

  useLenis((instance) => update(instance.scroll), [update]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const rail = railRef.current;
      if (!track || !rail) return;
      geometry.current = {
        top: track.getBoundingClientRect().top + window.scrollY,
        distance: Math.max(1, track.offsetHeight - window.innerHeight),
        travel: Math.max(0, rail.scrollWidth - track.clientWidth),
      };
      update(window.scrollY);
    };
    const observer = new ResizeObserver(measure);
    if (rootRef.current) observer.observe(rootRef.current);
    if (railRef.current) observer.observe(railRef.current);
    window.addEventListener("resize", measure);
    const nativeScroll = () => { if (!lenis) update(window.scrollY); };
    window.addEventListener("scroll", nativeScroll, { passive: true });
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); window.removeEventListener("scroll", nativeScroll); };
  }, [update, lenis]);

  const selectProject = (index: number) => {
    const { top, distance } = geometry.current;
    const target = top + distance * index / (projects.length - 1);
    if (lenis) lenis.scrollTo(target, { duration: .8, lock: false });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div ref={rootRef} className="portfolio-chapters">
      <section className="work-archive" id="work" aria-labelledby="work-title">
        <header className="work-archive__head">
          <p className="chapter-kicker">01 / Selected work</p>
          <h2 id="work-title">Beyond the atmosphere.<br /><em className="font-accent">Into the work.</em></h2>
          <p>Products, workflows, and a business built from the ground up.</p>
        </header>
        <div ref={trackRef} className="project-camera-track">
          <div className="project-camera">
            <div className="project-controls" role="group" aria-label="Choose a project">
              <span>Selected projects / 2026 & archive</span>
              <div>{projects.map((project, index) => <button key={project.title} onClick={() => selectProject(index)} aria-label={`Show ${project.title}`}>0{index + 1}</button>)}</div>
            </div>
            <div ref={railRef} className="project-orbit">
              {projects.map((project, index) => (
                <article className="project-card" key={project.title} aria-labelledby={`project-${index}`}>
                  <div className="project-card__visual">
                    <Image src={project.image} alt="" fill sizes="(max-width: 800px) 100vw, 40vw" />
                    <span className="project-card__number">0{index + 1}</span>
                    <span className="project-card__art-label">Lunar artwork / project cover</span>
                  </div>
                  <div className="project-card__content">
                    <div className="project-card__meta"><span>{project.type}</span><span>{project.year}</span></div>
                    <h3 id={`project-${index}`}>{project.title}</h3>
                    <p>{project.summary}</p>
                    <ul className="project-scope">{project.scope.map(item => <li key={item}>{item}</li>)}</ul>
                    <small>{project.stack}</small>
                    <a className="text-link" href={`mailto:stronghold.kingdom.777@gmail.com?subject=${encodeURIComponent(`Tell me about ${project.title}`)}`} onFocus={() => { if (window.matchMedia("(min-width: 801px) and (prefers-reduced-motion: no-preference)").matches) selectProject(index); }}>Discuss this project <span aria-hidden="true">↗</span></a>
                  </div>
                </article>
              ))}
            </div>
            <div className="project-progress" aria-hidden="true"><i /></div>
          </div>
        </div>
      </section>

      <section className="about-note" id="story" aria-labelledby="story-title">
        <p className="chapter-kicker">02 / A little context</p>
        <h2 id="story-title">A marketer’s eye.<br /><em className="font-accent">A developer’s discipline.</em></h2>
        <div><p>I came to development through search, content, and small businesses. I built, grew, monetized, and sold an affiliate project—learning the whole lifecycle.</p><p>That perspective still guides the work: understand why people arrive, then build what makes them stay.</p></div>
      </section>

      <section className="practice-sequence" id="process" aria-labelledby="process-title">
        <div className="practice-field__intro">
          <p className="chapter-kicker">03 / How I work</p>
          <h2 id="process-title">Intention in.<br /><em className="font-accent">Useful work out.</em></h2>
        </div>
        <div className="practice-cards">{practice.map(([index, title, body]) => <article key={index}><b>{index}</b><h3>{title}</h3><p>{body}</p></article>)}</div>
        <p className="practice-tools">React / Next.js / TypeScript / Node.js / MongoDB / WordPress / SEO</p>
      </section>

      <footer className="lunar-footer" id="contact">
        <div className="lunar-footer__top"><p className="chapter-kicker">04 / Your next chapter</p><a href="mailto:stronghold.kingdom.777@gmail.com">Let’s build something worth <em className="font-accent">remembering.</em> <span aria-hidden="true">↗</span></a></div>
        <div className="lunar-footer__links"><a href="https://github.com/espresso-gg" target="_blank" rel="noreferrer">GitHub ↗</a><a href="mailto:stronghold.kingdom.777@gmail.com">Email ↗</a><span>Pakistan / Available worldwide</span><a href="#origin">Back to the moon ↑</a></div>
        <p className="lunar-footer__name">Uzair Khurshid</p><small>© {new Date().getFullYear()} Uzair Khurshid</small>
      </footer>
    </div>
  );
}
