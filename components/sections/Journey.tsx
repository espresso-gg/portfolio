import type { JourneyItem } from "@/lib/types";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface JourneyProps {
  items: JourneyItem[];
}

export function Journey({ items }: JourneyProps) {
  return (
    <section className="journey-section section-pad" id="journey" aria-labelledby="journey-title">
      <ScrollReveal>
        <SectionHeader
          eyebrow="04 / Journey"
          title="The line is not random. It compounds."
          body="WordPress became SEO. SEO became owned projects. Owned projects became client judgment. Client judgment became stronger full-stack systems."
        />
      </ScrollReveal>

      <ol className="timeline">
        {items.map((item, index) => (
          <ScrollReveal key={item.title} delay={index * 0.06}>
            <li className="timeline-item">
              <span className="timeline-node" aria-hidden="true" />
              <p>{item.period}</p>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          </ScrollReveal>
        ))}
      </ol>
    </section>
  );
}
