"use client";

import { useEffect, useRef } from "react";
import type { ProjectItem } from "@/lib/types";
import { gsap } from "@/lib/gsap";

interface ProjectRailProps {
  projects: ProjectItem[];
}

export function ProjectRail({ projects }: ProjectRailProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!section || !track || prefersReducedMotion) {
      return undefined;
    }

    const context = gsap.context(() => {
      const distance = Math.max(0, track.scrollWidth - window.innerWidth + 64);

      gsap.to(track, {
        x: () => -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance + window.innerHeight}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <div ref={sectionRef} className="project-rail" id="projects">
      <div className="project-rail__intro">
        <p className="eyebrow">03 / Selected work</p>
        <h2>Projects that show the range: business systems, product workflows, and growth experiments.</h2>
      </div>
      <div ref={trackRef} className="project-track">
        {projects.map((project, index) => (
          <article className="project-card" key={project.title}>
            <span className="project-card__count">0{index + 1}</span>
            <div>
              <p className="project-card__type">{project.type} / {project.year}</p>
              <h3>{project.title}</h3>
            </div>
            <p>{project.summary}</p>
            <p className="project-card__impact">{project.impact}</p>
            <div className="project-card__stack" aria-label={`${project.title} tech stack`}>
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
