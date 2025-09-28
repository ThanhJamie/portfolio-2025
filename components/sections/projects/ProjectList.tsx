"use client";

import { Fragment } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectDetailSheet } from "@/components/sections/projects/ProjectDetailSheet";

import type { Project } from "./types";

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <section aria-labelledby="project-grid-heading" className="space-y-6">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3
            id="project-grid-heading"
            className="text-xl font-semibold text-foreground md:text-2xl"
          >
            Case studies ({projects.length})
          </h3>
          <p className="text-sm text-muted-foreground">
            Each project documents the problem, collaboration model, and measurable
            outcomes delivered.
          </p>
        </div>
      </header>

      {projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-muted/10 p-6 text-sm text-muted-foreground">
          No projects match those filters just yet. Try selecting a different combination
          to uncover more work.
        </p>
      ) : (
        <ul
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          aria-label="Project case studies"
        >
          {projects.map((project) => (
            <li key={project.id} className="flex">
              <Card className="flex flex-1 flex-col">
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{project.discipline}</Badge>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {project.timeline}
                    </p>
                  </div>
                  <CardTitle className="text-2xl font-semibold">
                    {project.title}
                  </CardTitle>
                  <CardDescription>{project.summary}</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-4">
                  <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">Role:</span>{" "}
                      {project.role}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Stack:</span>{" "}
                      {project.stack.join(", ")}
                    </p>
                  </div>

                  <dl className="grid gap-3 text-sm">
                    {project.outcomes.map((outcome) => (
                      <Fragment key={outcome.label}>
                        <dt className="font-medium text-foreground">{outcome.label}</dt>
                        <dd className="text-muted-foreground">{outcome.value}</dd>
                      </Fragment>
                    ))}
                  </dl>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="secondary">{project.focus}</Badge>
                    {project.stack.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <ProjectDetailSheet
                    project={project}
                    trigger={
                      <button
                        type="button"
                        className={cn(
                          buttonVariants({ size: "sm" }),
                          "w-full justify-center",
                        )}
                      >
                        View case study
                      </button>
                    }
                  />
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
