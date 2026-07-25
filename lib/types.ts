export interface SiteConfig {
  name: string;
  role: string;
  email: string;
  github: string;
  accent: string;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  name: string;
  tagline: string;
  intro: string;
  primaryCta: LinkItem;
}

export interface StoryBeat {
  label: string;
  title: string;
  body: string;
}

export interface SkillCategory {
  title: string;
  summary: string;
  items: string[];
}

export interface ProjectItem {
  title: string;
  type: string;
  year: string;
  stack: string[];
  summary: string;
  impact: string;
}

export interface JourneyItem {
  period: string;
  title: string;
  body: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  body: string;
  links: LinkItem[];
}
