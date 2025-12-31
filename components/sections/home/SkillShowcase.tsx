import Link from "next/link";
import { ArrowUpRight, Layers, Palette, Workflow } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import type { SkillGroup } from "@/lib/content/loaders";
import { cn } from "@/lib/utils";

interface SkillShowcaseProps {
  skills: SkillGroup[];
}

const iconPalette = [Layers, Workflow, Palette];

export function SkillShowcase({ skills }: SkillShowcaseProps) {
  const curated = skills
    .map((group) => ({
      ...group,
      items: group.items.slice(0, 4),
    }))
    .slice(0, 3);

  if (curated.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="home-skills-title"
      className="relative isolate overflow-hidden bg-gradient-to-b from-amber-50/40 via-background to-background"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(217,119,6,0.18),_transparent_60%)]" />
      <div
        className="absolute -bottom-20 left-1/4 size-72 rounded-full bg-amber-200/30 blur-3xl"
        aria-hidden="true"
      />

      <Container className="space-y-12 py-20">
        <div className="flex flex-col gap-6 text-center md:text-left">
          <Badge
            variant="outline"
            className="mx-auto w-fit bg-amber-100/80 px-4 py-2 text-amber-900 md:mx-0"
          >
            Craft foundations
          </Badge>
          <div className="space-y-4">
            <h2
              id="home-skills-title"
              className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
            >
              Skills that balance vision and delivery
            </h2>
            <p className="mx-auto max-w-3xl text-base text-foreground/80 md:mx-0">
              From research synthesis to production-ready interfaces, these are the
              systems and rituals I use to keep product teams shipping inclusive,
              measurable outcomes.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {curated.map((group, index) => {
            const Icon = iconPalette[index] ?? Layers;
            return (
              <Card
                key={group.id}
                className="group relative h-full overflow-hidden border border-border/50 bg-card/95 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-1"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500/70 via-amber-500 to-amber-500/70 opacity-80 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <CardHeader className="flex flex-row items-start gap-4">
                  <span className="rounded-full bg-amber-100 p-3 text-amber-700 shadow-inner">
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="sr-only">{group.title}</span>
                  </span>
                  <div className="space-y-1 text-left">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {group.title}
                    </CardTitle>
                    <p className="text-sm text-foreground/70">{group.summary}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-foreground/90">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1.5 rounded-full bg-amber-500"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-amber-200/70 bg-amber-50/80 p-6 text-sm text-foreground shadow-inner md:flex-row">
          <p className="text-center md:text-left">
            Want the full breakdown? Head over to the skills page for the complete
            operating system.
          </p>
          <Link
            href="/about"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "border-amber-400 text-amber-800 hover:bg-amber-100",
            )}
          >
            Explore skills &amp; tools
            <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
