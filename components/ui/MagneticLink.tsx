"use client";

import { type AnchorHTMLAttributes, type ReactNode, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function MagneticLink({ children, className = "", ...props }: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function handleMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(element, { x: x * 0.18, y: y * 0.22, duration: 0.35, ease: "power3.out" });
  }

  function handleLeave() {
    const element = ref.current;
    if (!element) return;

    gsap.to(element, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.42)" });
  }

  return (
    <a ref={ref} className={`magnetic-link ${className}`} onMouseMove={handleMove} onMouseLeave={handleLeave} {...props}>
      {children}
    </a>
  );
}
