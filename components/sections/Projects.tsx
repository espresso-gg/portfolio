import type { ProjectItem } from "@/lib/types";
import { ProjectRail } from "@/components/motion/ProjectRail";

interface ProjectsProps {
  projects: ProjectItem[];
}

export function Projects({ projects }: ProjectsProps) {
  return <ProjectRail projects={projects} />;
}
