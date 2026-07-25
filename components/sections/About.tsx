"use client";

import { useEffect, useRef } from "react";
import type { StoryBeat } from "@/lib/types";
import { gsap } from "@/lib/gsap";

interface AboutProps {
  beats: StoryBeat[];
}

export function About({ beats }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!section || prefersReducedMotion) {
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=280%",
          scrub: 1,
          pin: true,
        },
      });

      timeline
        .fromTo(".orbit-moon", { scale: 0.72, y: 90 }, { scale: 1.28, y: -8, duration: 1.2, ease: "none" })
        .fromTo(".orbit-veil", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55 }, 0.05)
        .fromTo(".orbit-ring", { scale: 0.58, autoAlpha: 0, rotate: -18 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 0.8 }, 0.26)
        .fromTo(".orbit-kicker, .orbit-title", { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.08 }, 0.32)
        .fromTo(".orbit-node", { scale: 0.72, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.4, stagger: 0.24 }, 0.56)
        .fromTo(".orbit-copy", { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.24 }, 0.68)
        .to(".orbit-system", { rotate: 10, duration: 1.4, ease: "none" }, 0.8)
        .to(".orbit-moon", { scale: 1.46, duration: 0.7, ease: "none" }, 1.55)
        .to(".orbit-shell", { autoAlpha: 0, y: -60, duration: 0.36 }, 2.05);
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} className="story-section orbit-section" id="story" aria-labelledby="story-title">
      <div className="orbit-veil" aria-hidden="true" />
      <div className="orbit-stars" aria-hidden="true" />

      <div className="orbit-shell">
        <div className="orbit-intro">
          <p className="orbit-kicker">01 / Lunar orbit story</p>
          <h2 className="orbit-title" id="story-title">
            Three phases shaped the work.
          </h2>
        </div>

        <div className="orbit-system" aria-label="Uzair's web development journey">
          <div className="orbit-moon" aria-hidden="true" />
          <div className="orbit-ring orbit-ring-one" aria-hidden="true" />
          <div className="orbit-ring orbit-ring-two" aria-hidden="true" />

          {beats.map((beat, index) => (
            <article className={`orbit-node orbit-node-${index + 1}`} key={beat.title}>
              <span className="orbit-dot" aria-hidden="true" />
              <p>{beat.label.replace(/^\d+\s\/\s/, "")}</p>
              <h3>{beat.title}</h3>
              <p className="orbit-copy">{beat.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
