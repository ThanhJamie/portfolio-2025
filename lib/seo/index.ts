import type {
  Profile,
  ProjectCaseStudy,
  ProjectGalleryItem,
} from "@/lib/contentlayer/schemas";

const DEFAULT_SITE_URL = "https://thanh.dang";

const hasProtocol = (value: string) => /^https?:\/\//i.test(value);

const sanitizeBaseUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  const normalized = hasProtocol(trimmed) ? trimmed : `https://${trimmed}`;
  return normalized.replace(/\/+$/, "");
};

export const getSiteBaseUrl = (): string => {
  const candidate =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL;

  return sanitizeBaseUrl(candidate);
};

export const buildSiteUrl = (pathname = "/", baseUrl = getSiteBaseUrl()): string => {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPath, `${baseUrl}/`).toString();
};

export const buildMetadataBase = (): URL => new URL(`${getSiteBaseUrl()}/`);

const collectGalleryImages = (gallery: ProjectGalleryItem[]): string[] =>
  gallery.filter((item) => item.type === "image").map((item) => item.src);

const toAbsoluteImageUrl = (imagePath: string): string =>
  hasProtocol(imagePath) ? imagePath : buildSiteUrl(imagePath);

export const buildPersonJsonLd = (profile: Profile): Record<string, unknown> => {
  const siteUrl = getSiteBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: buildSiteUrl("/", siteUrl),
    jobTitle: profile.headline,
    description: profile.tagline,
    image: toAbsoluteImageUrl(profile.heroImage.src),
    homeLocation: {
      "@type": "Place",
      name: profile.location,
    },
    sameAs: profile.socialLinks.map((link) => link.href),
    email: `mailto:${profile.primaryEmail}`,
    worksFor: {
      "@type": "Organization",
      name: profile.name,
    },
  } satisfies Record<string, unknown>;
};

export function buildProjectJsonLd(
  siteUrl: string,
  project: ProjectCaseStudy,
  authorName: string,
): Record<string, unknown> {
  const resolvedSiteUrl = sanitizeBaseUrl(siteUrl);
  const projectUrl = buildSiteUrl(`/projects/${project.slug}`, resolvedSiteUrl);

  const imageCandidates = [
    project.heroImage?.src,
    project.thumbnail,
    ...collectGalleryImages(project.gallery ?? []),
  ].filter((candidate): candidate is string => Boolean(candidate));

  const absoluteImages = imageCandidates.map(toAbsoluteImageUrl);
  const outcomes = project.outcomes.map((outcome) => ({
    "@type": "QuantitativeValue",
    name: outcome.label,
    value: outcome.value,
  }));

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": projectUrl,
    url: projectUrl,
    name: project.title,
    headline: project.summary,
    description: project.summary,
    author: {
      "@type": "Person",
      name: authorName,
      url: buildSiteUrl("/", resolvedSiteUrl),
    },
    creator: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Person",
      name: authorName,
    },
    datePublished: project.publishedAt,
    dateModified: project.publishedAt,
    about: project.problem,
    genre: project.focus,
    keywords: project.tags.join(", "),
    inLanguage: "en",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": projectUrl,
    },
    audience: {
      "@type": "Audience",
      audienceType: `${project.discipline} teams`,
    },
    temporalCoverage: project.timeline,
  };

  if (absoluteImages.length > 0) {
    jsonLd.image = absoluteImages;
    jsonLd.thumbnailUrl = absoluteImages[0];
  }

  if (outcomes.length > 0) {
    jsonLd.workExample = outcomes;
  }

  if (project.caseStudyUrl) {
    jsonLd.sameAs = project.caseStudyUrl;
  }

  if (project.liveUrl) {
    jsonLd.potentialAction = {
      "@type": "ViewAction",
      target: project.liveUrl,
      name: `View ${project.title} live`,
    } satisfies Record<string, unknown>;
  }

  return jsonLd;
}

export const buildProjectCollectionJsonLd = (
  projects: ProjectCaseStudy[],
  authorName: string,
): Record<string, unknown> => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Project Case Studies",
  description: "A curated list of product design and frontend case studies",
  itemListElement: projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: buildSiteUrl(`/projects/${project.slug}`),
    item: buildProjectJsonLd(getSiteBaseUrl(), project, authorName),
  })),
});
