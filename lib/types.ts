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
