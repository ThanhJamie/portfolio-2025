"use client";

import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import type { Project } from "@/components/sections/projects/types";

interface ProjectDetailSheetProps {
  project: Project;
  trigger: ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}

export function ProjectDetailSheet({
  project,
  trigger,
  side = "right",
}: ProjectDetailSheetProps) {
  const descriptionId = `project-detail-${project.id}-description`;

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent aria-describedby={descriptionId} className="max-w-2xl" side={side}>
        <div className="flex h-full flex-col gap-6 overflow-y-auto pb-6 pr-2">
          <SheetHeader className="space-y-2 text-left">
            <Badge variant="outline" className="self-start">
              {project.discipline}
            </Badge>
            <SheetTitle className="text-3xl font-semibold leading-tight">
              {project.title}
            </SheetTitle>
            <SheetDescription id={descriptionId} className="text-left">
              {project.summary}
            </SheetDescription>
          </SheetHeader>

          <div className="grid gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4 text-sm">
            <p>
              <span className="font-semibold text-foreground">Client:</span>{" "}
              {project.client}
            </p>
            <p>
              <span className="font-semibold text-foreground">Timeline:</span>{" "}
              {project.timeline}
            </p>
            <p>
              <span className="font-semibold text-foreground">Role:</span> {project.role}
            </p>
            <p>
              <span className="font-semibold text-foreground">Stack:</span>{" "}
              {project.stack.join(", ")}
            </p>
            <p>
              <span className="font-semibold text-foreground">Focus:</span>{" "}
              {project.focus}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">Problem framing</h4>
            <p className="text-sm text-muted-foreground">{project.problem}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">Approach</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {project.approach.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    aria-hidden="true"
                    className="mt-1 size-1.5 rounded-full bg-primary"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-foreground">Outcomes</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {project.outcomes.map((outcome) => (
                <li
                  key={outcome.label}
                  className="rounded-xl border border-border/40 bg-background p-3"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
                    {outcome.label}
                  </p>
                  <p className="mt-1 text-base text-foreground">{outcome.value}</p>
                </li>
              ))}
            </ul>
          </div>

          <Separator className="my-2" />

          <SheetFooter>
            <p className="text-sm text-muted-foreground">
              Full case study available on request. Get in touch to review annotated
              flows, deep-dive metrics, and collaboration notes tailored to your upcoming
              roadmap.
            </p>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
