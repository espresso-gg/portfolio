import type { ContactContent } from "@/lib/types";
import { MagneticLink } from "@/components/ui/MagneticLink";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

interface ContactProps {
  content: ContactContent;
}

export function Contact({ content }: ContactProps) {
  return (
    <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title">
      <ScrollReveal>
        <div className="contact-card">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2 id="contact-title">{content.title}</h2>
          <p>{content.body}</p>
          <div className="contact-links">
            {content.links.map((link) => (
              <MagneticLink key={link.label} href={link.href} className="contact-link">
                {link.label}
                <span aria-hidden="true">↗</span>
              </MagneticLink>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
