import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { storyBeats } from "@/content/about";
import { contactContent } from "@/content/contact";
import { heroContent } from "@/content/hero";
import { journey } from "@/content/journey";
import { projects } from "@/content/projects";
import { skillCategories } from "@/content/skills";

export default function Home() {
  void About;
  void storyBeats;
  void Contact;
  void Skills;
  void Projects;
  void Journey;
  void contactContent;
  void journey;
  void projects;
  void skillCategories;
  return (
    <main id="main-content" className="portfolio-stage">
      <Hero content={heroContent} beats={storyBeats} />
    </main>
  );
}
