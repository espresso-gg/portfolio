import type { ContactContent } from "@/lib/types";
import { siteConfig } from "@/lib/constants";

export const contactContent: ContactContent = {
  eyebrow: "Contact / next chapter",
  title: "If the work needs taste, structure, and momentum, I’m interested.",
  body:
    "I’m open to web development work, full-stack product builds, portfolio-grade frontends, and practical business systems.",
  links: [
    { label: "Email", href: `mailto:${siteConfig.email}` },
    { label: "GitHub", href: siteConfig.github },
    { label: "LinkedIn", href: "#" },
  ],
};
