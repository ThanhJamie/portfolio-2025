/**
 * Database-backed content loaders
 * Replaces file-based contentlayer loaders with Prisma queries
 */

import prisma from "@/lib/db";

// ==================== Type Definitions ====================
// These types match what components expect

export interface Profile {
  name: string;
  headline: string;
  tagline: string;
  location: string;
  primaryEmail: string;
  availability: string;
  heroImage: { src: string; alt: string };
  heroStats: Array<{ label: string; value: string; description: string }>;
  callToAction: { label: string; href: string };
  story: string[];
  focusAreas: string[];
  recentWins: string[];
  socialLinks: Array<{ label: string; href: string }>;
}

export interface SkillGroup {
  id: string;
  title: string;
  summary: string;
  items: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

export interface EducationItem {
  institution: string;
  credential: string;
  yearCompleted: string;
  location: string;
}

export interface CertificationItem {
  title: string;
  time: string;
  link: string;
  tech: string[];
}

export interface SocialProof {
  testimonials: Array<{
    quote: string;
    person: {
      name: string;
      title: string;
      company: string;
      avatar: string;
    };
  }>;
  logos: Array<{ name: string; src: string; alt: string }>;
  metrics: Array<{ label: string; value: string; description: string }>;
}

export interface TechStack {
  frontend: Array<{ name: string; summary: string }>;
  backend: Array<{ name: string; summary: string }>;
  ai_and_ml: Array<{ name: string; summary: string }>;
  tools_and_devops: Array<{ name: string; summary: string }>;
  concepts_and_principles: Array<{ name: string; summary: string }>;
}

export interface ToggleSettings {
  servicesEnabled: boolean;
  blogEnabled: boolean;
  testimonialsEnabled: boolean;
}

export interface ProjectCaseStudy {
  title: string;
  slug: string;
  client?: string;
  discipline?: string;
  focus: string;
  timeline?: string;
  summary: string;
  problem: string;
  approach: string[];
  role: string;
  stack: string[];
  outcomes: Array<{ label: string; value: string }>;
  tags: string[];
  thumbnail?: string;
  heroImage?: { src: string; alt: string };
  gallery: Array<{ type: string; src: string; alt: string; caption?: string }>;
  publishedAt: string;
  featured: boolean;
  caseStudyUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
}

// ==================== Loaders ====================

export async function loadProfile(): Promise<Profile> {
  const [profile, heroStats, focusAreas, recentWins, socialLinks] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.heroStat.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.focusArea.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.recentWin.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!profile) {
    throw new Error("Profile not found in database. Please run seed script.");
  }

  return {
    name: profile.name,
    headline: profile.headline,
    tagline: profile.tagline,
    location: profile.location,
    primaryEmail: profile.email,
    availability: profile.availability,
    heroImage: {
      src: profile.avatarUrl || "/images/placeholder.jpg",
      alt: `Portrait of ${profile.name}`,
    },
    heroStats: heroStats.map(
      (s: { label: string; value: string; description: string }) => ({
        label: s.label,
        value: s.value,
        description: s.description,
      }),
    ),
    callToAction: {
      label: "Contact Me",
      href: `mailto:${profile.email}`,
    },
    story: profile.summary.split("\n\n").filter(Boolean),
    focusAreas: focusAreas.map((f: { title: string }) => f.title),
    recentWins: recentWins.map((w: { content: string }) => w.content),
    socialLinks: socialLinks.map((l: { label: string; url: string }) => ({
      label: l.label,
      href: l.url,
    })),
  };
}

export async function loadSkillGroups(): Promise<SkillGroup[]> {
  const skills = await prisma.skill.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });

  // Group skills by category
  const grouped: Record<string, string[]> = {};
  for (const skill of skills) {
    if (!grouped[skill.category]) {
      grouped[skill.category] = [];
    }
    grouped[skill.category].push(skill.name);
  }

  return Object.entries(grouped).map(([category, items]) => ({
    id: category.toLowerCase().replace(/\s+/g, "-"),
    title: category,
    summary: "",
    items,
  }));
}

export async function loadExperienceItems(): Promise<ExperienceItem[]> {
  const experiences = await prisma.experience.findMany({
    where: { isVisible: true },
    orderBy: { startDate: "desc" },
  });

  return experiences.map(
    (exp: {
      id: string;
      company: string;
      position: string;
      location: string | null;
      startDate: Date;
      endDate: Date | null;
      isCurrent: boolean;
      description: string;
      highlights: string | null;
    }) => ({
      id: exp.id,
      company: exp.company,
      role: exp.position,
      location: exp.location || "",
      startDate: exp.startDate.toISOString().split("T")[0],
      endDate: exp.isCurrent ? "Present" : exp.endDate?.toISOString().split("T")[0] || "",
      summary: exp.description,
      highlights: JSON.parse(exp.highlights || "[]") as string[],
    }),
  );
}

export async function loadEducationEntries(): Promise<EducationItem[]> {
  const education = await prisma.education.findMany({
    where: { isVisible: true },
    orderBy: { endDate: "desc" },
  });

  return education.map(
    (edu: {
      institution: string;
      degree: string;
      endDate: Date | null;
      location: string | null;
    }) => ({
      institution: edu.institution,
      credential: edu.degree,
      yearCompleted: edu.endDate?.getFullYear().toString() || "",
      location: edu.location || "",
    }),
  );
}

export async function loadCertificationItems(): Promise<CertificationItem[]> {
  const certs = await prisma.certification.findMany({
    where: { isVisible: true },
    orderBy: { issueDate: "desc" },
  });

  return certs.map(
    (cert: {
      name: string;
      issueDate: Date;
      credentialUrl: string | null;
      description: string | null;
    }) => ({
      title: cert.name,
      time: cert.issueDate.toISOString().split("T")[0],
      link: cert.credentialUrl || "",
      tech: cert.description ? cert.description.split(", ").filter(Boolean) : [],
    }),
  );
}

export async function loadSocialProof(): Promise<SocialProof> {
  const [testimonials, logos, metrics] = await Promise.all([
    prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.companyLogo.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.metric.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return {
    testimonials: testimonials.map(
      (t: {
        quote: string;
        personName: string;
        personTitle: string;
        company: string;
        avatarUrl: string | null;
      }) => ({
        quote: t.quote,
        person: {
          name: t.personName,
          title: t.personTitle,
          company: t.company,
          avatar: t.avatarUrl || "",
        },
      }),
    ),
    logos: logos.map((l: { name: string; imageUrl: string; altText: string | null }) => ({
      name: l.name,
      src: l.imageUrl,
      alt: l.altText || `${l.name} logo`,
    })),
    metrics: metrics.map((m: { label: string; value: string; description: string }) => ({
      label: m.label,
      value: m.value,
      description: m.description,
    })),
  };
}

export async function loadTechStack(): Promise<TechStack> {
  const items = await prisma.techStackItem.findMany({
    where: { isVisible: true },
    orderBy: { sortOrder: "asc" },
  });

  const result: TechStack = {
    frontend: [],
    backend: [],
    ai_and_ml: [],
    tools_and_devops: [],
    concepts_and_principles: [],
  };

  for (const item of items) {
    const category = item.category as keyof TechStack;
    if (result[category]) {
      result[category].push({ name: item.name, summary: item.summary });
    }
  }

  return result;
}

export async function loadToggleSettings(): Promise<ToggleSettings> {
  const settings = await prisma.siteSettings.findFirst();

  return {
    servicesEnabled: settings?.servicesEnabled ?? false,
    blogEnabled: settings?.blogEnabled ?? false,
    testimonialsEnabled: settings?.testimonialsEnabled ?? true,
  };
}

export async function loadProjectCaseStudies(): Promise<ProjectCaseStudy[]> {
  const projects = await prisma.project.findMany({
    where: { isVisible: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  return projects.map(
    (p: {
      title: string;
      slug: string;
      client: string | null;
      role: string | null;
      category: string;
      timeline: string | null;
      summary: string;
      problem: string;
      approach: string | null;
      techStack: string | null;
      outcomes: string | null;
      tags: string | null;
      thumbnailUrl: string | null;
      heroImageUrl: string | null;
      gallery: string | null;
      caseStudyUrl: string | null;
      liveUrl: string | null;
      githubUrl: string | null;
      featured: boolean;
      publishedAt: Date | null;
    }) => ({
      title: p.title,
      slug: p.slug,
      client: p.client || undefined,
      discipline: p.role || undefined,
      focus: p.category,
      timeline: p.timeline || undefined,
      summary: p.summary,
      problem: p.problem,
      approach: JSON.parse(p.approach || "[]") as string[],
      role: p.role || "",
      stack: JSON.parse(p.techStack || "[]") as string[],
      outcomes: JSON.parse(p.outcomes || "[]") as Array<{ label: string; value: string }>,
      tags: JSON.parse(p.tags || "[]") as string[],
      thumbnail: p.thumbnailUrl || undefined,
      heroImage: p.heroImageUrl ? { src: p.heroImageUrl, alt: p.title } : undefined,
      gallery: JSON.parse(p.gallery || "[]") as Array<{
        type: string;
        src: string;
        alt: string;
        caption?: string;
      }>,
      publishedAt: p.publishedAt?.toISOString().split("T")[0] || "",
      featured: p.featured,
      caseStudyUrl: p.caseStudyUrl || undefined,
      liveUrl: p.liveUrl || undefined,
      githubUrl: p.githubUrl || undefined,
    }),
  );
}

export async function loadSiteContent() {
  const [
    profile,
    skillGroups,
    experience,
    education,
    certifications,
    socialProof,
    toggleSettings,
    projects,
    techStack,
  ] = await Promise.all([
    loadProfile(),
    loadSkillGroups(),
    loadExperienceItems(),
    loadEducationEntries(),
    loadCertificationItems(),
    loadSocialProof(),
    loadToggleSettings(),
    loadProjectCaseStudies(),
    loadTechStack(),
  ]);

  return {
    profile,
    skillGroups,
    experience,
    education,
    certifications,
    socialProof,
    toggleSettings,
    projects,
    techStack,
  };
}
