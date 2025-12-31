import type { MetadataRoute } from "next";

import { loadSiteContent } from "@/lib/content/loaders";
import { buildSiteUrl } from "@/lib/seo/index";

// Force dynamic - database content
export const dynamic = "force-dynamic";

const STATIC_ROUTES = ["/", "/about", "/projects", "/contact"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { projects } = await loadSiteContent();
  const generatedAt = new Date();

  const coreEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: buildSiteUrl(route),
    lastModified: generatedAt,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: buildSiteUrl(`/projects/${project.slug}`),
    lastModified: project.publishedAt ? new Date(project.publishedAt) : generatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...coreEntries, ...projectEntries];
}
