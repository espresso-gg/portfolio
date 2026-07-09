"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type Mood = "idle" | "curious" | "excited" | "running" | "waving" | "sleeping";

const messages: Record<Mood, string> = {
  idle: "hi.",
  curious: "go on…",
  excited: "yes!",
  running: "keep up!",
  waving: "let's talk.",
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
      duration: 0.72,
      ease: "elastic.out(1, 0.7)",
    });

    const onPointerMove = (event: PointerEvent) => {
      if (reduced || coarse) return;
      const targetX = gsap.utils.clamp(18, window.innerWidth - 112, event.clientX - 48);
      xTo(targetX);

      const rect = element.getBoundingClientRect();
      const lookX = gsap.utils.clamp(-5, 5, (event.clientX - (rect.left + rect.width / 2)) / 28);
      const lookY = gsap.utils.clamp(-4, 4, (event.clientY - (rect.top + 40)) / 34);
      element.style.setProperty("--look-x", `${lookX}px`);
      element.style.setProperty("--look-y", `${lookY}px`);
      element.style.setProperty("--lean", `${gsap.utils.clamp(-10, 10, event.movementX * 0.7)}deg`);

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
        .to(element, { y: 8, scaleY: 0.82, scaleX: 1.12, duration: 0.1 })
        .to(element, { y: -28, scaleY: 1.12, scaleX: 0.9, duration: 0.18, ease: "power2.out" })
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
      gsap.set(element, { x: window.innerWidth - 108 });
    } else {
      gsap.set(element, { x: Math.min(window.innerWidth * 0.18, window.innerWidth - 112) });
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
    <div
      ref={shell}
      className="companion"
      data-mood={mood}
      aria-hidden="true"
    >
      <div className="companion__bubble">
        <span className="companion__project">{projectId}</span>
        {messages[mood]}
      </div>
      <svg viewBox="0 0 120 150" role="presentation">
        <g className="companion__antenna">
          <path d="M60 24V11" />
          <circle cx="60" cy="8" r="5" />
        </g>
        <g className="companion__body">
          <rect x="31" y="43" width="58" height="64" rx="24" />
          <path d="M32 76H88" />
          <circle className="companion__badge" cx="60" cy="91" r="7" />
        </g>
        <g className="companion__face">
          <rect x="25" y="24" width="70" height="46" rx="19" />
          <g className="companion__eyes">
            <circle cx="48" cy="46" r="6" />
            <circle cx="72" cy="46" r="6" />
          </g>
          <path className="companion__mouth" d="M50 59 Q60 64 70 59" />
        </g>
        <g className="companion__arm companion__arm--left">
          <path d="M34 60Q15 68 22 91" />
          <circle cx="22" cy="94" r="5" />
        </g>
        <g className="companion__arm companion__arm--right">
          <path d="M86 60Q105 70 98 92" />
          <circle cx="98" cy="95" r="5" />
        </g>
        <g className="companion__leg companion__leg--left">
          <path d="M48 104V130" />
          <path d="M48 130H35" />
        </g>
        <g className="companion__leg companion__leg--right">
          <path d="M72 104V130" />
          <path d="M72 130H85" />
        </g>
      </svg>
      <div className="companion__shadow" />
    </div>
  );
}
