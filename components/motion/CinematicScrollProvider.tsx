"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function AnimationBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return undefined;

    const updateScrollTrigger = () => ScrollTrigger.update();
    const updateLenis = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", updateScrollTrigger);
      gsap.ticker.remove(updateLenis);
    };
  }, [lenis]);

  return null;
}

export function CinematicScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        anchors: { duration: 1.05, lock: true },
        lerp: 0.115,
        smoothWheel: true,
        syncTouch: false,
        stopInertiaOnNavigate: true,
        wheelMultiplier: 1,
      }}
    >
      <AnimationBridge />
      {children}
    </ReactLenis>
  );
}
