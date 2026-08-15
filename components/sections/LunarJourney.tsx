"use client";

import { useLenis } from "lenis/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { HeroContent } from "@/lib/types";

type JourneyPhase = "origin" | "approach" | "passage" | "orbit" | "descent" | "surface" | "exit";

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const range = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));
const smoothstep = (value: number) => value * value * (3 - 2 * value);
const smootherstep = (value: number) => value * value * value * (value * (value * 6 - 15) + 10);

function phaseFromProgress(progress: number): JourneyPhase {
  if (progress < 0.18) return "origin";
  if (progress < 0.36) return "approach";
  if (progress < 0.46) return "passage";
  if (progress < 0.68) return "orbit";
  if (progress < 0.82) return "descent";
  if (progress < 0.9) return "surface";
  return "exit";
}

export function LunarJourney({ content }: { content: HeroContent }) {
  const stageRef = useRef<HTMLElement>(null);
  const phaseRef = useRef<JourneyPhase>("origin");
  const [phase, setPhase] = useState<JourneyPhase>("origin");

  const updateJourney = useCallback((scroll: number) => {
    const root = stageRef.current;
    if (!root) return;

    const distance = Math.max(root.offsetHeight - window.innerHeight, 1);
    const progress = clamp(scroll / distance);
    const approach = smoothstep(range(progress, 0.16, 0.38));
    const passage = smoothstep(range(progress, 0.34, 0.47));
    const orbit = smoothstep(range(progress, 0.44, 0.68));
    const descent = smoothstep(range(progress, 0.66, 0.84));
    const surface = smoothstep(range(progress, 0.77, 0.88));
    const exitApproach = smootherstep(range(progress, 0.85, 0.96));
    const exitReveal = smootherstep(range(progress, 0.91, 0.997));

    root.style.setProperty("--journey-progress", progress.toFixed(4));
    root.style.setProperty("--approach", approach.toFixed(4));
    root.style.setProperty("--passage", passage.toFixed(4));
    root.style.setProperty("--orbit", orbit.toFixed(4));
    root.style.setProperty("--descent", descent.toFixed(4));
    root.style.setProperty("--surface", surface.toFixed(4));
    root.style.setProperty("--exit", exitApproach.toFixed(4));
    root.style.setProperty("--exit-reveal", exitReveal.toFixed(4));

    const nextPhase = phaseFromProgress(progress);
    if (nextPhase !== phaseRef.current) {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
    }
  }, []);

  useLenis((lenis) => updateJourney(lenis.scroll), [updateJourney]);

  useEffect(() => {
    updateJourney(window.scrollY);

    const handleResize = () => updateJourney(window.scrollY);
    const handlePointerMove = (event: PointerEvent) => {
      const root = stageRef.current;
      if (!root) return;
      root.style.setProperty("--pointer-x", ((event.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
      root.style.setProperty("--pointer-y", ((event.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, [updateJourney]);

  return (
    <section ref={stageRef} className={`lunar-voyage is-${phase}`} aria-label="A continuous lunar portfolio journey">
      <div className="voyage-viewport">
        <div className="voyage-sky" aria-hidden="true" />
        <div className="voyage-origin" aria-hidden="true" />
        <div className="voyage-stars" aria-hidden="true" />

        <div className="lunar-threshold" aria-hidden="true">
          <span className="lunar-threshold__bloom" />
          <span className="lunar-threshold__veil" />
        </div>

        <div className="warp-corridor" aria-hidden="true">
          {Array.from({ length: 16 }, (_, index) => (
            <i key={index} style={{ "--ray": index } as CSSProperties} />
          ))}
        </div>

        <div className="orbit-field" aria-hidden="true">
          <span className="orbit-ring orbit-ring--one" />
          <span className="orbit-ring orbit-ring--two" />
          <span className="orbit-satellite" />
        </div>

        <div className="surface-world" aria-hidden="true">
          <div className="surface-world__architecture" />
          <div className="surface-world__aperture" />
          <div className="surface-world__light" />
          <div className="surface-world__dust" />
        </div>

        <div className="surface-exit" aria-hidden="true">
          <div className="surface-exit__view" />
          <div className="surface-exit__bloom" />
        </div>

        <div className="voyage-grade" aria-hidden="true" />

        <header className="voyage-header">
          <a className="voyage-brand" href="#origin" aria-label="Return to the beginning">
            <span>UK</span>
            <strong>{content.name}</strong>
          </a>
          <nav aria-label="Lunar journey chapters">
            <a href="#story">Story</a>
            <a href="#work">Work</a>
            <a href="#process">Process</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <div className="voyage-copy voyage-copy--origin">
          <p>Web developer & creative engineer</p>
          <h1>{content.name}</h1>
          <span>{content.tagline}</span>
        </div>

        <div className="voyage-copy voyage-copy--approach">
          <p>From growth to engineering</p>
          <h2>I learned why people <em className="font-accent">arrive</em> before learning what makes them stay.</h2>
        </div>

        <div className="voyage-copy voyage-copy--orbit">
          <p>A wider field of view</p>
          <h2>The work spans discovery, <em className="font-accent">interface</em>, and infrastructure.</h2>
          <div className="orbit-notes">
            <article><b>01</b><h3>Discovery</h3><span>SEO, content, and information architecture.</span></article>
            <article><b>02</b><h3>Interface</h3><span>React experiences that clarify instead of decorate.</span></article>
            <article><b>03</b><h3>Infrastructure</h3><span>Next.js systems made for real operations.</span></article>
          </div>
        </div>

        <div className="voyage-copy voyage-copy--surface">
          <p>Current practice</p>
          <h2>Full-stack products, grounded in <em className="font-accent">commercial context.</em></h2>
          <span>I work across the complete web journey—from understanding why people arrive to engineering what makes the product useful after they do.</span>
          <ol className="observatory-pillars">
            <li><b>01</b><span><strong>Discovery</strong>Search, content, and product intent</span></li>
            <li><b>02</b><span><strong>Experience</strong>Interface, interaction, and accessibility</span></li>
            <li><b>03</b><span><strong>Systems</strong>Architecture, data, and production</span></li>
          </ol>
          <a href="mailto:stronghold.kingdom.777@gmail.com">Begin a conversation <i aria-hidden="true">↗</i></a>
        </div>

        <div className="voyage-meter" aria-hidden="true">
          <span>{phase === "origin" || phase === "approach" ? "01" : phase === "passage" || phase === "orbit" ? "02" : "03"}</span>
          <div><i /></div>
          <span>03</span>
        </div>

        <div className="voyage-scroll" aria-hidden="true"><i /> Scroll to travel</div>
      </div>

      <div className="voyage-track" aria-hidden="true">
        <span id="origin" />
        <span id="approach" />
        <span id="orbit" />
        <span id="descent" />
        <span id="surface" />
        <span id="surface-end" />
        <span id="exit" />
      </div>
    </section>
  );
}
