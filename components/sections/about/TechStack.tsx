import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import type { TechStack } from "@/lib/content/loaders";

interface TechStackProps {
  tech: TechStack;
}

const SECTION_CONFIG = [
  { key: "frontend", title: "Frontend" },
  { key: "backend", title: "Backend" },
  { key: "ai_and_ml", title: "AI & ML" },
  { key: "tools_and_devops", title: "Tools & DevOps" },
  { key: "concepts_and_principles", title: "Concepts & Principles" },
] satisfies ReadonlyArray<{ key: keyof TechStack; title: string }>;

export function TechStack({ tech }: TechStackProps) {
  const sections = SECTION_CONFIG.map((section) => ({
    ...section,
    items: tech[section.key],
  })).filter((section) => section.items?.length);

  if (sections.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="skills-technologies-heading"
      className="relative isolate bg-gradient-to-b from-background via-muted/20 to-background"
    >
      <div
        className="pointer-events-none absolute -left-24 top-1/4 size-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 size-64 rounded-full bg-secondary/20 blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative space-y-10 py-16">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
            Toolkit
          </p>
          <h2
            id="skills-technologies-heading"
            className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl"
          >
            Skills &amp; Technologies
          </h2>
          <p className="mx-auto max-w-3xl text-base text-foreground/75 md:mx-0">
            From shaping product strategy to shipping production-ready interfaces, these
            are the languages, platforms, and practices I rotate through to keep teams
            moving with confidence.
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
          {sections.map((section) => (
            <div key={section.key} className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
              <div className="flex flex-wrap gap-2">
                {section.items.map((item) => (
                  <Badge
                    key={item.name}
                    variant="outline"
                    title={item.summary}
                    className="rounded-full border-border/40 bg-background/90 px-3 py-1 text-sm font-semibold text-foreground shadow-sm transition hover:border-primary/40 hover:bg-primary/10"
                  >
                    {item.name}
                    <span className="sr-only"> — {item.summary}</span>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
