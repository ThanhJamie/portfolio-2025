import type { Metadata } from "next";
import type { ReactNode } from "react";

import type { Profile, ProjectCaseStudy } from "@/lib/content/loaders";

import { Container } from "@/components/ui/container";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { loadSiteContent } from "@/lib/content/loaders";
import {
  buildMetadataBase,
  buildPersonJsonLd,
  buildProjectCollectionJsonLd,
  buildProjectJsonLd,
  buildSiteUrl,
  getSiteBaseUrl,
} from "@/lib/seo/index";

// Force dynamic rendering - database content
export const dynamic = "force-dynamic";

interface SiteLayoutProps {
  children: ReactNode;
}

const buildKeywords = (profile: Profile, projects: ProjectCaseStudy[]) => {
  const keywordSet = new Set<string>();
  keywordSet.add("portfolio");
  keywordSet.add("product design");
  keywordSet.add("frontend engineering");
  keywordSet.add(profile.headline);
  profile.focusAreas.forEach((item) => keywordSet.add(item));
  profile.recentWins.forEach((item) => keywordSet.add(item));
  projects.forEach((project) => {
    keywordSet.add(project.focus);
    project.tags.forEach((tag) => keywordSet.add(tag));
  });

  return Array.from(keywordSet);
};

const toAbsoluteUrl = (path: string) =>
  path.startsWith("http") ? path : buildSiteUrl(path, getSiteBaseUrl());

export async function generateMetadata(): Promise<Metadata> {
  const { profile, projects } = await loadSiteContent();
  const siteUrl = getSiteBaseUrl();
  const canonicalUrl = buildSiteUrl("/", siteUrl);
  const featuredProject = projects.find((project) => project.featured) ?? projects[0];
  const ogImageSource = featuredProject?.heroImage?.src ?? profile.heroImage.src;
  const ogImageAlt = featuredProject?.heroImage?.alt ?? profile.heroImage.alt;
  const ogImageUrl = toAbsoluteUrl(ogImageSource);

  const title = `${profile.name} · ${profile.headline}`;
  const description = profile.tagline;

  return {
    metadataBase: buildMetadataBase(),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: buildKeywords(profile, projects),
    authors: [{ name: profile.name, url: buildSiteUrl("/about", siteUrl) }],
    creator: profile.name,
    publisher: profile.name,
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      siteName: profile.name,
      locale: "en_AU",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "Portfolio",
    other: {
      canonical: canonicalUrl,
    },
  } satisfies Metadata;
}

export default async function SiteLayout({ children }: SiteLayoutProps) {
  const siteContent = await loadSiteContent();
  const siteUrl = getSiteBaseUrl();
  const projectJsonLd = siteContent.projects.map((project) =>
    buildProjectJsonLd(siteUrl, project, siteContent.profile.name),
  );
  const personJsonLd = buildPersonJsonLd(siteContent.profile);
  const projectCollectionJsonLd = buildProjectCollectionJsonLd(
    siteContent.projects,
    siteContent.profile.name,
  );
  const structuredData = JSON.stringify([
    personJsonLd,
    projectCollectionJsonLd,
    ...projectJsonLd,
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: structuredData }}
      />
      <SiteHeader />
      <main id="main" role="main" className="flex-1">
        <Container className="py-12">{children}</Container>
      </main>
      <SiteFooter />
    </div>
  );
}
