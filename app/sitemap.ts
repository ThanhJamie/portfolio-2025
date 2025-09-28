import type { MetadataRoute } from "next";

import { loadSiteContent } from "@/lib/contentlayer/loaders";
import { buildSiteUrl } from "@/lib/seo/index";

const STATIC_ROUTES = ["/", "/about", "/projects", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const { projects } = loadSiteContent();
  const generatedAt = new Date();

  const coreEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: buildSiteUrl(route),
    lastModified: generatedAt,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: buildSiteUrl(`/projects/${project.slug}`),
    lastModified: project.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...coreEntries, ...projectEntries];
}
