"use client";

import { ReactLenis, useLenis } from "lenis/react";
import type { ReactNode } from "react";
import { useEffect, useSyncExternalStore } from "react";
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

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(motionQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function CinematicScrollProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false);
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        anchors: { duration: reduced ? 0 : .85, immediate: reduced, lock: false },
        lerp: 0.115,
        smoothWheel: !reduced,
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
