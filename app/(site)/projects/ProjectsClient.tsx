"use client";

import { useMemo, useState } from "react";

import { ProjectFilters } from "@/components/sections/projects/ProjectFilters";
import { ProjectList } from "@/components/sections/projects/ProjectList";
import type {
  Project,
  ProjectDiscipline,
  ProjectFocus,
} from "@/components/sections/projects/types";

interface ProjectsClientProps {
  projects: Project[];
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const [discipline, setDiscipline] = useState<ProjectDiscipline>("All");
  const [focus, setFocus] = useState<ProjectFocus>("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const disciplineMatch = discipline === "All" || project.discipline === discipline;
      const focusMatch = focus === "All" || project.focus === focus;
      return disciplineMatch && focusMatch;
    });
  }, [projects, discipline, focus]);

  return (
    <div className="space-y-12">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
          Projects
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Case studies & outcomes
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          A curated selection of end-to-end initiatives spanning product discovery, design
          systems, and frontend engineering. Each engagement highlights collaboration
          models, inclusive processes, and measurable business impact.
        </p>
      </header>

      <ProjectFilters
        discipline={discipline}
        focus={focus}
        onDisciplineChange={setDiscipline}
        onFocusChange={setFocus}
      />

      <ProjectList projects={filteredProjects} />
    </div>
  );
}
