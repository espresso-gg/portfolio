import type { ProjectItem } from "@/lib/types";

export const projects: ProjectItem[] = [
  {
    title: "Inventory Management System",
    type: "Business operations platform",
    year: "2026",
    stack: ["Next.js", "TypeScript", "Node.js", "MongoDB"],
    summary:
      "A real business system for Pakistan’s solar inverter and battery market, covering stock, customers, staff, finances, and operational visibility.",
    impact:
      "Built around everyday business pressure: faster lookup, cleaner records, and fewer blind spots across inventory and finance.",
  },
  {
    title: "Job Application Tracker",
    type: "Final year project",
    year: "2026",
    stack: ["React", "Node.js", "MongoDB"],
    summary:
      "A focused tracker for managing applications, statuses, company details, and follow-ups from one organized workflow.",
    impact:
      "Turns scattered job search activity into a system that can be reviewed, filtered, and improved.",
  },
  {
    title: "Headphones Affiliate Project",
    type: "SEO + content business",
    year: "Built and sold",
    stack: ["WordPress", "SEO", "Content Strategy"],
    summary:
      "An affiliate site built from scratch, grown through content and search strategy, then sold after proving its value.",
    impact:
      "The project taught the full lifecycle: niche research, content architecture, ranking, monetization, and exit.",
  },
];
