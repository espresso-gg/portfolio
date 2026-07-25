"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
}: ScrollRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = rootRef.current;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!element || prefersReducedMotion) {
      return undefined;
    }

    const offsets = {
      up: { x: 0, y: 56 },
      left: { x: -72, y: 0 },
      right: { x: 72, y: 0 },
    };

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, ...offsets[direction] },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 1.1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 78%",
            once: true,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, [delay, direction]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
