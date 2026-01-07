"use client";

import type { Dispatch, SetStateAction } from "react";

import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

import type { ProjectDiscipline, ProjectFocus } from "./types";

interface ProjectFiltersProps {
  discipline: ProjectDiscipline;
  focus: ProjectFocus;
  onDisciplineChange: Dispatch<SetStateAction<ProjectDiscipline>>;
  onFocusChange: Dispatch<SetStateAction<ProjectFocus>>;
}

const disciplineOptions: ProjectDiscipline[] = [
  "All",
  "Full-Stack Developer",
  "Frontend Developer",
  "Backend/AI Developer",
  "Data/AI Engineer",
];

const focusOptions: ProjectFocus[] = [
  "All",
  "AI Integration",
  "Machine Learning",
  "Full-Stack",
  "E-commerce",
];

export function ProjectFilters({
  discipline,
  focus,
  onDisciplineChange,
  onFocusChange,
}: ProjectFiltersProps) {
  return (
    <section aria-labelledby="project-filters-heading" className="space-y-8">
      <div className="space-y-3">
        <SectionHeading id="project-filters-heading" className="text-center md:text-left">
          Featured Projects
        </SectionHeading>
        <p className="text-sm text-muted-foreground md:text-base">
          Explore cross-disciplinary work spanning strategy, systems, and shipping. Use
          the filters to find case studies aligned with your current initiative.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Discipline
          </legend>
          <div
            role="radiogroup"
            aria-label="Filter projects by discipline"
            className="flex flex-wrap gap-2"
          >
            {disciplineOptions.map((option) => {
              const isActive = option === discipline;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onDisciplineChange(option)}
                  className={cn(
                    buttonVariants({
                      variant: isActive ? "default" : "outline",
                      size: "sm",
                    }),
                    "rounded-full px-4",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Focus Area
          </legend>
          <div
            role="radiogroup"
            aria-label="Filter projects by focus area"
            className="flex flex-wrap gap-2"
          >
            {focusOptions.map((option) => {
              const isActive = option === focus;
              return (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  onClick={() => onFocusChange(option)}
                  className={cn(
                    buttonVariants({
                      variant: isActive ? "default" : "outline",
                      size: "sm",
                    }),
                    "rounded-full px-4",
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
