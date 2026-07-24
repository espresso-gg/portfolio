"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Mood = "idle" | "curious" | "excited" | "running" | "waving" | "sleeping";

const messages: Record<Mood, string> = {
  idle: "ready.",
  curious: "inspect?",
  excited: "slash!",
  running: "move!",
  waving: "send scroll.",
  sleeping: "z z z",
};

export default function CursorCompanion() {
  const shell = useRef<HTMLDivElement>(null);
  const [mood, setMood] = useState<Mood>("idle");
  const [projectId, setProjectId] = useState("");
  const moodRef = useRef<Mood>("idle");

  useEffect(() => {
    const element = shell.current;
    if (!element) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let idleTimer = 0;
    let runTimer = 0;
    let previousScroll = window.scrollY;
    let contactVisible = false;

    const changeMood = (next: Mood) => {
      if (moodRef.current === next) return;
      moodRef.current = next;
      setMood(next);
    };

    const wakeLater = () => {
      window.clearTimeout(idleTimer);
      if (!contactVisible) changeMood("idle");
      idleTimer = window.setTimeout(() => {
        if (!contactVisible) changeMood("sleeping");
      }, 4200);
    };

    const xTo = gsap.quickTo(element, "x", {
      duration: 0.7,
      ease: "elastic.out(1, 0.7)",
    });

    const onPointerMove = (event: PointerEvent) => {
      if (reduced || coarse) return;
      const targetX = gsap.utils.clamp(18, window.innerWidth - 128, event.clientX - 54);
      xTo(targetX);

      const rect = element.getBoundingClientRect();
      const lookX = gsap.utils.clamp(-5, 5, (event.clientX - (rect.left + rect.width / 2)) / 30);
      const lookY = gsap.utils.clamp(-4, 4, (event.clientY - (rect.top + 42)) / 36);
      element.style.setProperty("--look-x", `${lookX}px`);
      element.style.setProperty("--look-y", `${lookY}px`);
      element.style.setProperty("--lean", `${gsap.utils.clamp(-10, 10, event.movementX * 0.65)}deg`);

      const target = event.target as HTMLElement;
      const project = target.closest<HTMLElement>("[data-project]");
      const interactive = target.closest("a, button");
      window.clearTimeout(idleTimer);

      if (project) {
        const nextProject = project.dataset.project ?? "";
        element.dataset.project = nextProject;
        setProjectId(nextProject);
        changeMood("excited");
      } else if (interactive) {
        element.dataset.project = "";
        setProjectId("");
        changeMood("curious");
      } else if (!contactVisible) {
        element.dataset.project = "";
        setProjectId("");
        changeMood("idle");
      }

      idleTimer = window.setTimeout(() => {
        if (!contactVisible) changeMood("sleeping");
      }, 4200);
    };

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      const project = target.closest<HTMLElement>("[data-project]");
      const interactive = target.closest("a, button");
      if (project) {
        element.dataset.project = project.dataset.project ?? "";
        setProjectId(project.dataset.project ?? "");
        changeMood("excited");
      } else if (interactive) {
        element.dataset.project = "";
        setProjectId("");
        changeMood("curious");
      }
    };

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("a, button, [data-project]")) {
        element.dataset.project = "";
        setProjectId("");
        wakeLater();
      }
    };

    const onPointerDown = () => {
      changeMood("excited");
      gsap.timeline()
        .to(element, { y: 8, scaleY: 0.84, scaleX: 1.12, duration: 0.1 })
        .to(element, { y: -28, scaleY: 1.1, scaleX: 0.9, duration: 0.18, ease: "power2.out" })
        .to(element, { y: 0, scale: 1, duration: 0.42, ease: "bounce.out" });
      wakeLater();
    };

    const onScroll = () => {
      const delta = window.scrollY - previousScroll;
      previousScroll = window.scrollY;
      if (Math.abs(delta) < 3 || contactVisible) return;
      element.style.setProperty("--direction", delta < 0 ? "-1" : "1");
      changeMood("running");
      window.clearTimeout(runTimer);
      runTimer = window.setTimeout(wakeLater, 220);
    };

    const contact = document.querySelector("#contact");
    const observer = contact
      ? new IntersectionObserver(
          ([entry]) => {
            contactVisible = entry.isIntersecting;
            if (entry.isIntersecting) changeMood("waving");
            else wakeLater();
          },
          { threshold: 0.3 },
        )
      : null;
    if (contact) observer?.observe(contact);

    if (coarse) {
      gsap.set(element, { x: window.innerWidth - 112 });
    } else {
      gsap.set(element, { x: Math.min(window.innerWidth * 0.16, window.innerWidth - 128) });
    }
    wakeLater();

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(runTimer);
      observer?.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScroll);
      gsap.killTweensOf(element);
    };
  }, []);

  return (
    <div ref={shell} className="companion" data-mood={mood} aria-hidden="true">
      <div className="companion__bubble">
        <span className="companion__project">{projectId}</span>
        {messages[mood]}
      </div>
      <svg viewBox="0 0 130 160" role="presentation">
        <path className="companion__sword" d="M92 115L121 45" />
        <path className="companion__coat" d="M39 76C31 92 26 118 22 145H108C103 118 99 92 91 76C77 85 54 85 39 76Z" />
        <path className="companion__scarf" d="M42 76C57 88 74 88 89 76L84 96C71 104 57 104 45 96Z" />
        <path className="companion__hat" d="M22 51L65 16L108 51Z" />
        <path className="companion__hat" d="M13 55C39 45 91 45 117 55C88 65 42 65 13 55Z" />
        <rect className="companion__face" x="34" y="48" width="62" height="42" rx="18" />
        <g className="companion__eyes">
          <circle cx="55" cy="68" r="5" />
          <circle cx="76" cy="68" r="5" />
        </g>
        <path className="companion__mouth" d="M56 80Q65 84 74 80" />
        <g className="companion__arm companion__arm--left">
          <path d="M39 84Q18 98 25 124" />
          <circle cx="25" cy="126" r="5" />
        </g>
        <g className="companion__arm companion__arm--right">
          <path d="M90 84Q113 98 103 123" />
          <circle cx="103" cy="125" r="5" />
        </g>
        <g className="companion__leg companion__leg--left">
          <path d="M52 139V153" />
          <path d="M52 153H39" />
        </g>
        <g className="companion__leg companion__leg--right">
          <path d="M78 139V153" />
          <path d="M78 153H91" />
        </g>
      </svg>
      <div className="companion__shadow" />
    </div>
  );
}
