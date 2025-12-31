import { Container } from "@/components/ui/container";
import type { ExperienceItem } from "@/lib/content/loaders";

interface ExperienceProps {
  experience: ExperienceItem[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
});

const formatRange = (startDate: string, endDate: string): string => {
  const start = DATE_FORMATTER.format(new Date(startDate));

  if (endDate.toLowerCase() === "present") {
    return `${start} – Present`;
  }

  const end = DATE_FORMATTER.format(new Date(endDate));
  return `${start} – ${end}`;
};

export function Experience({ experience }: ExperienceProps) {
  const timeline = [...experience]
    .sort((a, b) => (a.startDate > b.startDate ? -1 : 1))
    .map((item) => ({
      ...item,
      highlights: item.highlights.map((highlight) => highlight.trim()).filter(Boolean),
      range: formatRange(item.startDate, item.endDate),
    }));

  return (
    <section className="bg-background" aria-labelledby="experience-heading">
      <Container className="py-16">
        <header className="max-w-2xl space-y-3">
          <h2 id="experience-heading" className="text-3xl font-semibold tracking-tight">
            Experience Timeline
          </h2>
          <p className="text-base text-foreground/75">
            A decade of building and scaling products with scrappy startups and
            growth-stage teams.
          </p>
        </header>

        <ol
          aria-label="Experience Timeline"
          className="mt-12 space-y-8 border-l border-border/40 pl-6"
        >
          {timeline.map((job) => (
            <li key={job.id} className="relative space-y-3">
              <span className="absolute -left-6 mt-1 inline-flex size-3 rounded-full border border-background bg-primary" />
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
                {job.range}
              </p>
              <h3 className="text-xl font-semibold text-foreground">
                {job.role} · {job.company}
              </h3>
              <p className="text-sm text-foreground/70">{job.location}</p>
              <p className="text-sm text-foreground/80">{job.summary}</p>
              <ul className="space-y-2 text-sm text-foreground">
                {job.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-1 size-1.5 rounded-full bg-primary"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
