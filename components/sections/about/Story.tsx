import { Container } from "@/components/ui/container";
import type { Profile } from "@/lib/content/loaders";

interface StoryProps {
  profile: Profile;
}

export function Story({ profile }: StoryProps) {
  const storyParagraphs = profile.story.length > 0 ? profile.story : [profile.tagline];
  const focusAreas = profile.focusAreas;
  const recentWins = profile.recentWins;

  return (
    <section aria-labelledby="about-story-heading" className="bg-background">
      <Container className="py-16">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            About
          </p>
          <div className="space-y-4">
            <h1
              id="about-story-heading"
              className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              About {profile.name}
            </h1>
            {storyParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-base text-foreground/75">
                {paragraph}
              </p>
            ))}
          </div>
          {(focusAreas.length > 0 || recentWins.length > 0) && (
            <div className="grid gap-4 rounded-2xl border border-border/60 bg-muted/30 p-6 sm:grid-cols-2">
              {focusAreas.length > 0 ? (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground/65">
                    Focus
                  </h2>
                  <ul className="space-y-2 text-base text-foreground">
                    {focusAreas.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-1 size-1.5 rounded-full bg-primary"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {recentWins.length > 0 ? (
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground/65">
                    Recent wins
                  </h2>
                  <ul className="space-y-2 text-base text-foreground">
                    {recentWins.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-1 size-1.5 rounded-full bg-primary"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
