"use client";

import { useEffect, useRef } from "react";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { LunarWebGL } from "@/components/motion/LunarWebGL";
import type { HeroContent, StoryBeat } from "@/lib/types";
import { gsap } from "@/lib/gsap";

interface HeroProps {
  content: HeroContent;
  beats: StoryBeat[];
}

export function Hero({ content, beats }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!section || prefersReducedMotion) {
      return undefined;
    }

    const image = section.querySelector<HTMLElement>(".lunar-art__image");
    const atmosphere = section.querySelector<HTMLElement>(".lunar-atmosphere");
    const handlePointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      image?.style.setProperty("--lunar-drift-x", `${x * -0.7}%`);
      image?.style.setProperty("--lunar-drift-y", `${y * -0.45}%`);
      atmosphere?.style.setProperty("--lunar-glow-x", `${50 + x * 8}%`);
      atmosphere?.style.setProperty("--lunar-glow-y", `${52 + y * 7}%`);
    };

    section.addEventListener("pointermove", handlePointerMove);

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

      timeline
        .from(".lunar-art", { scale: 1.08, autoAlpha: 0, duration: 1.6 })
        .from(".lunar-brand-mark, .lunar-nav a", { y: -14, autoAlpha: 0, duration: 0.8, stagger: 0.05 }, "-=1.05")
        .from(".lunar-subtitle", { y: 18, autoAlpha: 0, filter: "blur(12px)", duration: 0.85 }, "-=0.55")
        .from(".lunar-word", { yPercent: 105, autoAlpha: 0, filter: "blur(18px)", duration: 1.25 }, "-=0.5")
        .from(".lunar-copy", { y: 20, autoAlpha: 0, filter: "blur(10px)", duration: 0.9 }, "-=0.55")
        .from(".lunar-bottom-panel", { y: 18, autoAlpha: 0, duration: 0.85 }, "-=0.35");

      const journey = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=220%",
          scrub: 1,
        },
      });

      journey
        .to(".lunar-title", { y: -130, autoAlpha: 0, filter: "blur(16px)", duration: 0.22, ease: "none" }, 0.12)
        .to(".lunar-header", { y: -24, autoAlpha: 0.34, duration: 0.18, ease: "none" }, 0.1)
        .to(".lunar-bottom-panel", { autoAlpha: 0, duration: 0.12, ease: "none" }, 0.08)
        .to(".lunar-art__image", { scale: 1.18, autoAlpha: 0.08, transformOrigin: "50% 25%", filter: "saturate(1.18) contrast(1.08) brightness(0.95)", duration: 0.58, ease: "none" }, 0)
        .to(".lunar-atmosphere", { opacity: 0.25, duration: 0.5, ease: "none" }, 0.16)
        .to(".lunar-story-layer", { autoAlpha: 1, visibility: "visible", duration: 0.18, ease: "none" }, 0.42)
        .to(".lunar-story-heading", { y: 0, autoAlpha: 1, duration: 0.16, ease: "none" }, 0.5)
        .to(".lunar-story-node", { y: 0, autoAlpha: 1, scale: 1, duration: 0.14, stagger: 0.08, ease: "none" }, 0.58);

    }, section);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      context.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="hero-section lunar-hero lunar-journey lunar-scene-test" id="home" aria-labelledby="hero-title">
      <div className="lunar-art" aria-hidden="true">
        <div
          className="lunar-art__image"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundImage: "url('/lunar-stage1-bg.png')",
            backgroundPosition: "center",
            backgroundSize: "cover",
            opacity: 1,
          }}
        />
      </div>
      <LunarWebGL />
      <div className="lunar-atmosphere" aria-hidden="true" />
      <div className="lunar-story-layer" id="story" aria-labelledby="story-title" style={{ display: "none" }}>
        <div className="lunar-story-heading">
          <p className="orbit-kicker">01 / Lunar orbit story</p>
          <h2 id="story-title">Three phases shaped the work.</h2>
          <p>Scroll deeper into the same moonlit frame.</p>
        </div>
        <div className="lunar-story-orbit" aria-label="Uzair's web development journey">
          <span className="lunar-story-ring lunar-story-ring-one" aria-hidden="true" />
          <span className="lunar-story-ring lunar-story-ring-two" aria-hidden="true" />
          {beats.map((beat, index) => (
            <article className={`lunar-story-node lunar-story-node-${index + 1}`} key={beat.title}>
              <span className="orbit-dot" aria-hidden="true" />
              <p>{beat.label.replace(/^\d+\s\/\s/, "")}</p>
              <h3>{beat.title}</h3>
              <p className="orbit-copy">{beat.body}</p>
            </article>
          ))}
        </div>
        <div className="lunar-journey-progress" aria-hidden="true">
          <span className="is-active" />
          <span />
          <span />
        </div>
      </div>

      <div className="lunar-shell" style={{ display: "none" }}>
        <header className="lunar-header">
          <div className="lunar-brand">
            <span className="lunar-brand-mark">UK</span>
            <span>Uzair Khurshid</span>
          </div>
          <nav className="lunar-nav" aria-label="Portfolio sections">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#projects">Work</a>
            <a href="#skills">Skills</a>
            <a href="#journey">Journey</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>

        <div className="lunar-title" id="hero-title">
          <p className="lunar-subtitle">Web developer & creative engineer</p>
          <h1 aria-label={content.name}>
            <span className="lunar-word-mask">
              <span className="lunar-word">{content.name}</span>
            </span>
          </h1>
          <p className="lunar-copy">Crafting immersive web experiences with intention & elegance</p>
        </div>

        <div className="lunar-bottom-panel">
          <MagneticLink href={content.primaryCta.href} className="lunar-scroll-cue">
            <span className="lunar-scroll-icon" aria-hidden="true" />
            <span>Scroll to explore</span>
          </MagneticLink>
        </div>
      </div>
    </section>
  );
}
