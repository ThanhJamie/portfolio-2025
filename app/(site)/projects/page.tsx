import { getProjectCaseStudies } from "@/lib/content/hooks";
import { ProjectsClient } from "./ProjectsClient";
import type { Project } from "@/components/sections/projects/types";

// Force dynamic rendering - database content
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projectCaseStudies = await getProjectCaseStudies();

  // Map database format to UI format
  // discipline = role (simplified), focus = category (normalized from loaders' focus field)
  const projects: Project[] = projectCaseStudies.map((p) => {
    // Simplify role for filtering (remove "& UI/UX Designer", "Lead" prefix, etc.)
    const simplifiedRole = (p.role || "Full-Stack Developer")
      .replace(/^Lead\s+/i, "")
      .replace(/\s*&.*$/i, "")
      .trim();

    // Normalize focus (which comes from database category) for filtering
    const normalizedCategory = ((): string => {
      const rawCategory = p.focus || "Full-Stack";
      const cat = rawCategory.toLowerCase();
      if (cat.includes("ai integration") || cat.includes("content management"))
        return "AI Integration";
      if (cat.includes("machine learning") || cat === "ai/ml") return "Machine Learning";
      if (cat.includes("e-commerce") || cat.includes("ecommerce")) return "E-commerce";
      if (cat.includes("full-stack") || cat.includes("fullstack")) return "Full-Stack";
      return rawCategory;
    })();

    return {
      id: p.slug,
      title: p.title,
      client: p.client || "",
      timeline: p.timeline || "",
      discipline: simplifiedRole as Project["discipline"],
      focus: normalizedCategory as Project["focus"],
      summary: p.summary,
      problem: p.problem,
      approach: p.approach,
      role: p.role,
      stack: p.stack,
      outcomes: p.outcomes,
      thumbnail: p.thumbnail || p.title.substring(0, 2).toUpperCase(),
    };
  });

  return <ProjectsClient projects={projects} />;
}
