import { Accessibility, Code2, Rocket } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import type { SocialProof } from "@/lib/contentlayer/schemas";

interface HighlightsProps {
  metrics: SocialProof["metrics"];
}

const highlightIcons = [Code2, Accessibility, Rocket];

export function Highlights({ metrics }: HighlightsProps) {
  const cards = metrics.slice(0, highlightIcons.length);

  return (
    <section
      aria-labelledby="home-highlights-title"
      className="relative isolate overflow-hidden bg-muted/20"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.22),_transparent_60%)]" />
      <Container className="space-y-12 py-16">
        <div className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Highlights
          </p>
          <h2
            id="home-highlights-title"
            className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
          >
            Product leadership grounded in craft
          </h2>
          <p className="mx-auto max-w-2xl text-base text-foreground/75">
            The combination of human intelligence and the power of science, of artificial
            intelligence Each project balances accessibility, speed and measurable
            results, and integrates, uses, AI technologies to improve product quality
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((metric, index) => {
            const Icon = highlightIcons[index] ?? Rocket;
            return (
              <Card
                key={metric.label}
                className="group relative h-full overflow-hidden border border-border/60 bg-card/95 shadow-lg backdrop-blur transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 opacity-70 transition-opacity duration-200 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <CardHeader className="flex flex-row items-start gap-4">
                  <span className="rounded-full bg-primary/15 p-3 text-primary shadow-inner">
                    <Icon className="size-5" aria-hidden="true" />
                    <span className="sr-only">{metric.label}</span>
                  </span>
                  <div className="text-left">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {metric.label}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-2xl font-semibold text-foreground md:text-3xl">
                      {metric.value}
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/70">
                      {metric.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
