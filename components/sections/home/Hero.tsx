import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Profile, SocialProof } from "@/lib/contentlayer/schemas";
import { cn } from "@/lib/utils";

interface HeroProps {
  profile: Profile;
  testimonial?: SocialProof["testimonials"][number];
}

export function Hero({ profile }: HeroProps) {
  const extendedStats: Array<{ label: string; value: string; description?: string }> = [
    ...profile.heroStats,
    {
      label: "Location",
      value: profile.location,
      description: profile.availability,
    },
  ];

  const heroBadgeDetail = profile.heroStats[0]
    ? `${profile.heroStats[0].value} ${profile.heroStats[0].label.toLowerCase()}`
    : (profile.recentWins[0] ?? "Trusted collaborator");

  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 size-80 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-72 translate-x-20 translate-y-20 rounded-full bg-secondary/30 blur-3xl" />
      </div>

      <Container className="flex flex-col gap-16 py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-[0.7rem] uppercase tracking-[0.35em] text-primary/70 shadow-soft">
              <span className="font-semibold">{profile.headline}</span>
              <span className="text-muted-foreground/70">{heroBadgeDetail}</span>
            </div>

            <div className="space-y-4">
              <h1
                id="home-hero-title"
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl"
              >
                Hi, I&apos;m {profile.name}
              </h1>
              <p className="max-w-2xl text-lg text-foreground/75 md:text-xl">
                {profile.tagline}
              </p>
            </div>

            <ul className="flex flex-wrap items-center gap-2">
              {profile.focusAreas.map((area) => (
                <li key={area}>
                  <Badge
                    variant="outline"
                    className="bg-background/70 text-sm normal-case"
                  >
                    {area}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={"/projects" as Route}
              className={cn(
                buttonVariants({ size: "lg" }),
                "shadow-lg shadow-primary/20",
              )}
            >
              View projects
            </Link>
            <Link
              href={"/contact" as Route}
              className={cn(
                buttonVariants({ size: "lg", variant: "secondary" }),
                "bg-secondary/80 text-secondary-foreground",
              )}
            >
              Book a collaboration call
            </Link>
            <a
              href={profile.callToAction.href}
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-dashed border-border/70 text-foreground/80",
              )}
            >
              {profile.callToAction.label}
            </a>
          </div>

          <dl className="grid gap-4 rounded-3xl border border-border/60 bg-background/80 p-6 shadow-xl backdrop-blur sm:grid-cols-2 lg:max-w-2xl">
            {extendedStats.map((stat) => (
              <div key={stat.label} className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">
                  {stat.label}
                </dt>
                <dd className="text-lg font-semibold text-foreground">
                  {stat.value}
                  {stat.description ? (
                    <p className="text-sm font-normal text-foreground/65">
                      {stat.description}
                    </p>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex justify-center lg:flex-1">
          <div className="absolute -top-8 right-12 hidden size-40 rounded-full bg-primary/20 blur-2xl lg:block" />
          <figure className="relative isolate flex aspect-[4/5] w-full max-w-md items-center justify-center overflow-hidden rounded-[2.5rem] border border-border/40 bg-gradient-to-br from-background via-background to-primary/10 shadow-2xl">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.28),_transparent_55%)]"
              aria-hidden="true"
            />
            <Image
              src={profile.heroImage.src}
              alt={profile.heroImage.alt}
              width={640}
              height={800}
              priority
              className="relative z-10 size-full object-cover"
            />
            <figcaption className="sr-only">{profile.heroImage.alt}</figcaption>
            <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2">
              <Badge
                className="border border-primary/50 bg-primary/95 px-4 py-2 text-sm font-semibold text-primary-foreground shadow-xl backdrop-blur-sm"
                variant="default"
              >
                AI-powered Full-stack Developer
              </Badge>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}
