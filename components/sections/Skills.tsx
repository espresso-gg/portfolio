import type { SkillCategory } from "@/lib/types";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface SkillsProps {
  categories: SkillCategory[];
}

export function Skills({ categories }: SkillsProps) {
  return (
    <section className="skills-section section-pad" id="skills" aria-labelledby="skills-title">
      <ScrollReveal>
        <SectionHeader
          eyebrow="02 / Capabilities"
          title="Three layers working together."
          body="The portfolio should feel cinematic, but the substance is practical: systems thinking, frontend craft, and a growth background that keeps the work pointed at outcomes."
        />
      </ScrollReveal>

      <div className="skill-stack">
        {categories.map((category, index) => (
          <ScrollReveal key={category.title} delay={index * 0.07}>
            <article className="skill-panel">
              <div>
                <span>0{index + 1}</span>
                <h3>{category.title}</h3>
              </div>
              <p>{category.summary}</p>
              <ul>
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
