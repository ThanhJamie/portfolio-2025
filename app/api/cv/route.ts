import { pdf } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { CVTemplate } from "@/lib/pdf/cv-template";
import {
  loadEducationEntries,
  loadExperienceItems,
  loadSkillGroups,
  loadProfile,
  loadProjectCaseStudies,
  loadTechStack,
  loadCertificationItems,
  loadSocialProof,
  type EducationItem,
  type ExperienceItem,
  type ProjectCaseStudy,
} from "@/lib/content/loaders";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Load all data from database
    const [
      profile,
      experience,
      education,
      skills,
      projects,
      techStack,
      certifications,
      socialProof,
    ] = await Promise.all([
      loadProfile(),
      loadExperienceItems(),
      loadEducationEntries(),
      loadSkillGroups(),
      loadProjectCaseStudies(),
      loadTechStack(),
      loadCertificationItems(),
      loadSocialProof(),
    ]);

    // Sort experience by date (newest first)
    const sortedExperience = experience.sort((a: ExperienceItem, b: ExperienceItem) => {
      const dateA =
        a.endDate.toLowerCase() === "present" ? new Date() : new Date(a.endDate);
      const dateB =
        b.endDate.toLowerCase() === "present" ? new Date() : new Date(b.endDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Helper function to extract technologies from skill items
    const extractTechnologies = (items: string[]): string[] => {
      const techRegex = /\(([^)]+)\)/g;
      const technologies: string[] = [];

      items.forEach((item) => {
        const matches = item.matchAll(techRegex);
        for (const match of matches) {
          const techs = match[1].split(/[,/]/).map((t) => t.trim());
          technologies.push(...techs);
        }
      });

      return [...new Set(technologies)]; // Remove duplicates
    };

    // Transform skills data for CV with extracted technologies
    const transformedSkills = skills.map((group) => ({
      category: group.title,
      summary: group.summary,
      items: extractTechnologies(group.items),
    }));

    // Prepare CV data
    const cvData = {
      profile: {
        name: profile.name,
        headline: profile.headline,
        location: profile.location,
        primaryEmail: profile.primaryEmail,
        tagline: profile.tagline,
        story: profile.story,
        focusAreas: profile.focusAreas,
        socialLinks: profile.socialLinks,
        recentWins: profile.recentWins,
      },
      experience: sortedExperience.map((exp: ExperienceItem) => ({
        company: exp.company,
        role: exp.role,
        location: exp.location,
        startDate: exp.startDate,
        endDate: exp.endDate,
        summary: exp.summary,
        highlights: exp.highlights,
      })),
      education: education.map((edu: EducationItem) => ({
        institution: edu.institution,
        credential: edu.credential,
        yearCompleted: edu.yearCompleted,
        location: edu.location,
      })),
      skills: transformedSkills,
      techStack: {
        frontend: techStack.frontend,
        backend: techStack.backend,
        ai_and_ml: techStack.ai_and_ml,
        tools_and_devops: techStack.tools_and_devops,
      },
      projects: projects
        .filter((p: ProjectCaseStudy) => p.featured)
        .slice(0, 3)
        .map((p: ProjectCaseStudy) => ({
          title: p.title,
          client: p.client || "",
          role: p.role,
          timeline: p.timeline || "",
          summary: p.summary,
          stack: p.stack,
          outcomes: p.outcomes,
        })),
      certifications: certifications.slice(0, 7).map((cert) => ({
        title: cert.title,
        time: cert.time || "",
        link: cert.link || "",
      })),
      metrics: socialProof.metrics,
    };

    // Generate PDF - CVTemplate is a function component that returns a Document
    // We need to call it and pass the result to pdf()
    const pdfInstance = pdf(CVTemplate({ data: cvData }));
    const pdfBuffer = await pdfInstance.toBuffer();

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${profile.name.replace(/\s+/g, "_")}_CV.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating CV:", error);
    return NextResponse.json({ error: "Failed to generate CV" }, { status: 500 });
  }
}
