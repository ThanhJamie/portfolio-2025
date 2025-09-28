import { Container } from "@/components/ui/container";
import type { SkillGroup } from "@/lib/contentlayer/schemas";

interface SkillsProps {
  skills: SkillGroup[];
}

export function Skills({ skills }: SkillsProps) {
  const normalizedSkills = [...skills]
    .sort((a, b) => a.title.localeCompare(b.title))
    .map((group) => ({
      ...group,
      items: group.items.map((item) => item.trim()).filter(Boolean),
    }));

  return (
    <section
      aria-labelledby="skills-overview-heading"
      className="border-y border-border/60 bg-muted/10"
    >
      <Container className="py-16">
        <div className="space-y-12">
          <header className="max-w-2xl space-y-3">
            <h2
              id="skills-overview-heading"
              className="text-3xl font-semibold tracking-tight"
            >
              Skills Overview
            </h2>
            <p className="text-base text-foreground/75">
              A blend of strategy, systems thinking, and hands-on execution honed across
              product-led teams.
            </p>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            {normalizedSkills.map((category) => (
              <article
                key={category.title}
                className="rounded-2xl border border-border/40 bg-background p-6 shadow-sm"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {category.title}
                  </h3>
                  <p className="text-sm text-foreground/70">{category.summary}</p>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-foreground">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-1 size-1.5 rounded-full bg-primary"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
