import { pdf } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { CVTemplateFromDB } from "@/lib/pdf/cv-template-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Load all data from database
    const [profile, experiences, education, skills, projects, certifications] =
      await Promise.all([
        prisma.profile.findFirst(),
        prisma.experience.findMany({
          where: { isVisible: true },
          orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
        }),
        prisma.education.findMany({
          where: { isVisible: true },
          orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
        }),
        prisma.skill.findMany({
          where: { isVisible: true },
          orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
        }),
        prisma.project.findMany({
          where: { isVisible: true, featured: true },
          orderBy: { sortOrder: "asc" },
          take: 3,
        }),
        prisma.certification.findMany({
          where: { isVisible: true },
          orderBy: { sortOrder: "asc" },
          take: 5,
        }),
      ]);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found. Please add your profile in Admin panel first." },
        { status: 404 },
      );
    }

    // Group skills by category
    const skillsByCategory: Record<string, typeof skills> = {};
    for (const skill of skills) {
      if (!skillsByCategory[skill.category]) skillsByCategory[skill.category] = [];
      skillsByCategory[skill.category].push(skill);
    }

    // Prepare CV data
    const cvData = {
      profile: {
        name: profile.name,
        headline: profile.headline,
        tagline: profile.tagline,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        summary: profile.summary,
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
        websiteUrl: profile.websiteUrl,
      },
      experiences: experiences.map(
        (exp: {
          company: string;
          position: string;
          location: string | null;
          startDate: Date;
          endDate: Date | null;
          isCurrent: boolean;
          description: string;
          highlights: string | null;
          employmentType: string | null;
        }) => ({
          company: exp.company,
          position: exp.position,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate,
          isCurrent: exp.isCurrent,
          description: exp.description,
          highlights: safeParseJSON<string[]>(exp.highlights, []),
          employmentType: exp.employmentType || "",
        }),
      ),
      education: education.map(
        (edu: {
          institution: string;
          degree: string;
          field: string;
          location: string | null;
          startDate: Date | null;
          endDate: Date | null;
          isCurrent: boolean;
          gpa: string | null;
        }) => ({
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          location: edu.location || "",
          startDate: edu.startDate || new Date(),
          endDate: edu.endDate,
          isCurrent: edu.isCurrent,
          gpa: edu.gpa || "",
        }),
      ),
      skills: Object.entries(skillsByCategory).map(([category, items]) => ({
        category,
        items: items.map((s: { name: string }) => s.name),
      })),
      projects: projects.map(
        (p: {
          title: string;
          role: string | null;
          client: string | null;
          timeline: string | null;
          summary: string;
          techStack: string | null;
          outcomes: string | null;
          liveUrl: string | null;
          githubUrl: string | null;
        }) => ({
          title: p.title,
          role: p.role || "",
          client: p.client || "",
          timeline: p.timeline || "",
          summary: p.summary,
          techStack: safeParseJSON<string[]>(p.techStack, []),
          outcomes: safeParseJSON<{ label: string; value: string }[]>(p.outcomes, []),
          liveUrl: p.liveUrl || "",
          githubUrl: p.githubUrl || "",
        }),
      ),
      certifications: certifications.map(
        (cert: {
          name: string;
          issuer: string;
          issueDate: Date;
          credentialUrl: string | null;
        }) => ({
          name: cert.name,
          issuer: cert.issuer,
          issueDate: cert.issueDate,
          credentialUrl: cert.credentialUrl,
        }),
      ),
    };

    // Generate PDF - CVTemplateFromDB returns a Document element
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
    const pdfInstance = pdf(CVTemplateFromDB({ data: cvData }) as any);
    const pdfBuffer = await pdfInstance.toBuffer();

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${profile.name.replace(/\s+/g, "_")}_Resume.pdf"`,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error generating CV from database:", error);
    return NextResponse.json({ error: "Failed to generate CV" }, { status: 500 });
  }
}

function safeParseJSON<T>(str: string | null | undefined, fallback: T): T {
  if (!str) return fallback;
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}
