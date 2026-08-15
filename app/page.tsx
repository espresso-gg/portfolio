import { LunarJourney } from "@/components/sections/LunarJourney";
import { PortfolioChapters } from "@/components/sections/PortfolioChapters";
import { heroContent } from "@/content/hero";

export default function Home() {
  return (
    <main id="main-content">
      <LunarJourney content={heroContent} />
      <PortfolioChapters />
    </main>
  );
}
