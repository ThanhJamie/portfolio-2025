import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";

// Create Prisma client with LibSQL adapter
// Supports both Turso (production) and local SQLite (development)
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

console.log("📦 Database:", tursoUrl ? "Turso (cloud)" : "Local SQLite");

const adapter = new PrismaLibSql({
  url: tursoUrl || "file:./dev.db",
  authToken: tursoUrl ? tursoAuthToken : undefined,
});
const prisma = new PrismaClient({ adapter });

const contentJsonDir = join(process.cwd(), "content", "json");
const contentMdxDir = join(process.cwd(), "content", "mdx", "projects");

function readJson<T>(relativePath: string): T {
  const filePath = join(contentJsonDir, relativePath);
  return JSON.parse(readFileSync(filePath, "utf-8")) as T;
}

function readCollection<T>(folder: string): T[] {
  const directory = join(contentJsonDir, folder);
  return readdirSync(directory)
    .filter((file) => file.endsWith(".json"))
    .map((file) => JSON.parse(readFileSync(join(directory, file), "utf-8")) as T);
}

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing data
  await prisma.profile.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.education.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.focusArea.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.companyLogo.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.techStackItem.deleteMany();
  await prisma.heroStat.deleteMany();
  await prisma.recentWin.deleteMany();
  await prisma.socialLink.deleteMany();

  // 1. Seed Profile
  console.log("📝 Seeding profile...");
  const profileData = readJson<{
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
  }>("profile.json");

  await prisma.profile.create({
    data: {
      name: profileData.name,
      headline: profileData.headline,
      tagline: profileData.tagline,
      email: profileData.primaryEmail,
      location: profileData.location,
      availability: profileData.availability,
      avatarUrl: profileData.heroImage.src,
      summary: profileData.story.join("\n\n"),
      linkedinUrl: profileData.socialLinks.find((l) => l.label === "LinkedIn")?.href,
      githubUrl: profileData.socialLinks.find((l) => l.label === "GitHub")?.href,
    },
  });

  // Seed Hero Stats
  for (let i = 0; i < profileData.heroStats.length; i++) {
    const stat = profileData.heroStats[i];
    await prisma.heroStat.create({
      data: {
        label: stat.label,
        value: stat.value,
        description: stat.description,
        sortOrder: i,
      },
    });
  }

  // Seed Focus Areas
  for (let i = 0; i < profileData.focusAreas.length; i++) {
    await prisma.focusArea.create({
      data: {
        title: profileData.focusAreas[i],
        sortOrder: i,
      },
    });
  }

  // Seed Recent Wins
  for (let i = 0; i < profileData.recentWins.length; i++) {
    await prisma.recentWin.create({
      data: {
        content: profileData.recentWins[i],
        sortOrder: i,
      },
    });
  }

  // Seed Social Links
  for (let i = 0; i < profileData.socialLinks.length; i++) {
    const link = profileData.socialLinks[i];
    await prisma.socialLink.create({
      data: {
        label: link.label,
        url: link.href,
        sortOrder: i,
      },
    });
  }

  // 2. Seed Experience
  console.log("💼 Seeding experience...");
  const experiences = readCollection<{
    id: string;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
  }>("experience");

  for (let i = 0; i < experiences.length; i++) {
    const exp = experiences[i];
    await prisma.experience.create({
      data: {
        company: exp.company,
        position: exp.role,
        location: exp.location,
        startDate: new Date(exp.startDate),
        endDate: exp.endDate === "Present" ? null : new Date(exp.endDate),
        isCurrent: exp.endDate === "Present",
        description: exp.summary,
        highlights: JSON.stringify(exp.highlights),
        sortOrder: i,
      },
    });
  }

  // 3. Seed Education
  console.log("🎓 Seeding education...");
  const educationItems = readCollection<{
    institution: string;
    credential: string;
    yearCompleted: string;
    location: string;
  }>("education");

  for (let i = 0; i < educationItems.length; i++) {
    const edu = educationItems[i];
    await prisma.education.create({
      data: {
        institution: edu.institution,
        degree: edu.credential,
        field: "",
        location: edu.location,
        startDate: new Date(`${parseInt(edu.yearCompleted) - 4}-01-01`),
        endDate: new Date(`${edu.yearCompleted}-01-01`),
        sortOrder: i,
      },
    });
  }

  // 4. Seed Skills (from skill groups)
  console.log("🛠️ Seeding skills...");
  const skillGroups = readCollection<{
    id: string;
    title: string;
    summary: string;
    items: string[];
  }>("skills");

  let skillOrder = 0;
  for (const group of skillGroups) {
    for (const item of group.items) {
      await prisma.skill.create({
        data: {
          name: item,
          category: group.title,
          sortOrder: skillOrder++,
        },
      });
    }
  }

  // 5. Seed Tech Stack
  console.log("💻 Seeding tech stack...");
  const techStack = readJson<{
    frontend: Array<{ name: string; summary: string }>;
    backend: Array<{ name: string; summary: string }>;
    ai_and_ml: Array<{ name: string; summary: string }>;
    tools_and_devops: Array<{ name: string; summary: string }>;
    concepts_and_principles: Array<{ name: string; summary: string }>;
  }>("tech-stack.json");

  const categories = [
    { key: "frontend", items: techStack.frontend },
    { key: "backend", items: techStack.backend },
    { key: "ai_and_ml", items: techStack.ai_and_ml },
    { key: "tools_and_devops", items: techStack.tools_and_devops },
    { key: "concepts_and_principles", items: techStack.concepts_and_principles },
  ];

  let techOrder = 0;
  for (const cat of categories) {
    for (const item of cat.items) {
      await prisma.techStackItem.create({
        data: {
          name: item.name,
          summary: item.summary,
          category: cat.key,
          sortOrder: techOrder++,
        },
      });
    }
  }

  // 6. Seed Social Proof (Testimonials, Logos, Metrics)
  console.log("🌟 Seeding social proof...");
  const socialProof = readJson<{
    testimonials: Array<{
      quote: string;
      person: { name: string; title: string; company: string; avatar: string };
    }>;
    logos: Array<{ name: string; src: string; alt: string }>;
    metrics: Array<{ label: string; value: string; description: string }>;
  }>("social-proof.json");

  for (let i = 0; i < socialProof.testimonials.length; i++) {
    const t = socialProof.testimonials[i];
    await prisma.testimonial.create({
      data: {
        quote: t.quote,
        personName: t.person.name,
        personTitle: t.person.title,
        company: t.person.company,
        avatarUrl: t.person.avatar,
        sortOrder: i,
      },
    });
  }

  for (let i = 0; i < socialProof.logos.length; i++) {
    const logo = socialProof.logos[i];
    await prisma.companyLogo.create({
      data: {
        name: logo.name,
        imageUrl: logo.src,
        altText: logo.alt,
        sortOrder: i,
      },
    });
  }

  for (let i = 0; i < socialProof.metrics.length; i++) {
    const metric = socialProof.metrics[i];
    await prisma.metric.create({
      data: {
        label: metric.label,
        value: metric.value,
        description: metric.description,
        sortOrder: i,
      },
    });
  }

  // 7. Seed Settings
  console.log("⚙️ Seeding settings...");
  const toggles = readJson<{
    servicesEnabled: boolean;
    blogEnabled: boolean;
    testimonialsEnabled: boolean;
  }>("toggles.json");

  await prisma.siteSettings.create({
    data: {
      servicesEnabled: toggles.servicesEnabled,
      blogEnabled: toggles.blogEnabled,
      testimonialsEnabled: toggles.testimonialsEnabled,
    },
  });

  // 8. Seed Certifications
  console.log("🏆 Seeding certifications...");
  try {
    // JSON uses: title, time, link, tech
    // Database uses: name, issuer, issueDate, credentialUrl
    const certifications = readJson<
      Array<{
        title: string;
        time: string;
        link: string;
        tech?: string[];
      }>
    >("certifications.json");

    for (let i = 0; i < certifications.length; i++) {
      const cert = certifications[i];
      await prisma.certification.create({
        data: {
          name: cert.title,
          issuer: "Coursera", // Default issuer from certification links
          issueDate: new Date(cert.time),
          credentialUrl: cert.link,
          description: cert.tech
            ? cert.tech.filter((t) => t !== "...").join(", ")
            : undefined,
          sortOrder: i,
        },
      });
    }
    console.log(`   Seeded ${certifications.length} certifications`);
  } catch (error) {
    console.log("   Error seeding certifications:", error);
  }

  // 9. Seed Projects from MDX
  console.log("🚀 Seeding projects...");
  try {
    const mdxFiles = readdirSync(contentMdxDir).filter((file) => file.endsWith(".mdx"));

    for (let i = 0; i < mdxFiles.length; i++) {
      const file = mdxFiles[i];
      const filePath = join(contentMdxDir, file);
      const content = readFileSync(filePath, "utf-8");
      const { data } = matter(content) as {
        data: {
          title?: string;
          slug?: string;
          summary?: string;
          problem?: string;
          approach?: string[];
          role?: string;
          liveUrl?: string;
          githubUrl?: string;
          caseStudyUrl?: string;
          thumbnail?: string;
          heroImage?: { src?: string };
          gallery?: unknown[];
          stack?: string[];
          outcomes?: unknown[];
          focus?: string;
          tags?: string[];
          client?: string;
          timeline?: string;
          featured?: boolean;
          publishedAt?: string;
        };
      };

      await prisma.project.create({
        data: {
          title: data.title || file.replace(".mdx", ""),
          slug: data.slug || file.replace(".mdx", ""),
          summary: data.summary || "",
          description: data.problem || "",
          problem: data.problem || "",
          approach: JSON.stringify(data.approach || []),
          role: data.role || "",
          liveUrl: data.liveUrl || null,
          githubUrl: data.githubUrl || null,
          caseStudyUrl: data.caseStudyUrl || null,
          thumbnailUrl: data.thumbnail || null,
          heroImageUrl: data.heroImage?.src || null,
          gallery: JSON.stringify(data.gallery || []),
          techStack: JSON.stringify(data.stack || []),
          outcomes: JSON.stringify(data.outcomes || []),
          category: data.focus || "Web Development",
          tags: JSON.stringify(data.tags || []),
          client: data.client || null,
          timeline: data.timeline || null,
          featured: data.featured || false,
          publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
          sortOrder: i,
        },
      });
    }
  } catch (error) {
    console.log("   Error seeding projects:", error);
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
