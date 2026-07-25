import type { SkillCategory } from "@/lib/types";

export const skillCategories: SkillCategory[] = [
  {
    title: "Modern full-stack",
    summary: "Application interfaces, APIs, data models, dashboards, and admin workflows.",
    items: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
  },
  {
    title: "Motion & frontend craft",
    summary: "Scroll-driven storytelling, polished transitions, interaction states, and visual systems.",
    items: ["GSAP", "ScrollTrigger", "Lenis", "Framer Motion", "Tailwind CSS"],
  },
  {
    title: "Web growth background",
    summary: "The practical layer that makes sites legible to humans and discoverable by search.",
    items: ["WordPress", "Google SEO", "Content Writing", "Affiliate Strategy"],
  },
];
