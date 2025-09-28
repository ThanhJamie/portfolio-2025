import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import type { CertificationItem, EducationItem } from "@/lib/contentlayer/schemas";

interface EducationProps {
  education: EducationItem[];
  certifications: CertificationItem[];
}

export function Education({ education, certifications }: EducationProps) {
  const entries = [...education]
    .sort((a, b) => Number(b.yearCompleted) - Number(a.yearCompleted))
    .map((item) => ({
      ...item,
      credential: item.credential.trim(),
      institution: item.institution.trim(),
      location: item.location.trim(),
      yearCompleted: item.yearCompleted.trim(),
    }));

  const certificationEntries = certifications.map((item) => ({
    ...item,
    title: item.title.trim(),
    time: item.time.trim(),
    link: item.link.trim(),
    tech: Array.isArray(item.tech)
      ? item.tech.map((tech) => tech.trim()).filter(Boolean)
      : [],
  }));

  return (
    <section
      aria-labelledby="education-heading"
      className="border-t border-border/60 bg-muted/5"
    >
      <Container className="py-16">
        <header className="max-w-2xl space-y-4">
          <h2 id="education-heading" className="text-4xl font-semibold tracking-tight">
            Education &amp; Certifications
          </h2>
          <p className="text-lg text-foreground/75">
            Formal training and continuous learning that keep Thanh at the forefront of
            product craft.
          </p>
        </header>

        <div className="mt-12 space-y-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                Formal Education
              </h3>
              <p className="text-base text-foreground/70">
                Degrees and programs that anchor Thanh’s multidisciplinary practice.
              </p>
            </div>

            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {entries.map((entry) => (
                <li key={`${entry.institution}-${entry.credential}`} className="group">
                  <article className="relative overflow-hidden rounded-3xl border border-border/40 bg-gradient-to-br from-background via-background to-background/60 p-6 transition duration-200 hover:border-primary/60 hover:shadow-xl">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-20 -top-24 size-[220px] rounded-full bg-primary/10 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="relative space-y-4">
                      <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary">
                        {entry.yearCompleted}
                      </span>
                      <h3 className="text-2xl font-semibold text-secondary">
                        <span className="sr-only">
                          {entry.institution} – {entry.credential}
                        </span>
                        <span aria-hidden="true">{entry.institution}</span>
                      </h3>
                      <p className="text-lg font-medium text-foreground/80">
                        {entry.credential}
                      </p>
                      <p className="text-sm text-foreground/60">{entry.location}</p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
          {certificationEntries.length > 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-[0.32em] text-primary">
                  Certifications
                </h3>
                <p className="text-base text-foreground/70">
                  Verifications of ongoing learning across product, engineering, and
                  cloud.
                </p>
              </div>

              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {certificationEntries.map((cert) => (
                  <li key={`${cert.title}-${cert.time}`} className="group">
                    <a
                      className="flex h-full flex-col justify-between gap-5 rounded-3xl border border-border/40 bg-background p-6 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 group-hover:border-primary/60 group-hover:bg-primary/5"
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="space-y-4">
                        <p className="text-lg font-semibold text-secondary">
                          {cert.title}
                        </p>
                        <p className="text-sm font-medium text-foreground/75">
                          {cert.time}
                        </p>
                        {cert.tech.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {cert.tech.map((tech) => (
                              <Badge
                                key={`${cert.title}-${tech}`}
                                variant="outline"
                                className="border-border/60 bg-background/80 text-[0.65rem] font-medium tracking-[0.08em]"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="inline-flex items-center whitespace-nowrap text-sm font-semibold text-primary transition group-hover:translate-x-1">
                        View
                        <svg
                          aria-hidden="true"
                          className="ml-1 size-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 7L7 17m0-10h10v10"
                          />
                        </svg>
                      </span>
                      <span className="sr-only">Opens in a new tab</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
