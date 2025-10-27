import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { SafeParseReturnType } from "zod";
import matter from "gray-matter";

import {
  educationCollectionSchema,
  educationItemSchema,
  certificationCollectionSchema,
  certificationItemSchema,
  experienceCollectionSchema,
  experienceItemSchema,
  profileCollectionSchema,
  profileSchema,
  projectCaseStudySchema,
  projectCollectionSchema,
  skillGroupCollectionSchema,
  skillGroupSchema,
  socialProofCollectionSchema,
  socialProofSchema,
  techStackCollectionSchema,
  techStackSchema,
  toggleSettingsCollectionSchema,
  toggleSettingsSchema,
  type EducationItem,
  type CertificationItem,
  type ExperienceItem,
  type Profile,
  type ProjectCaseStudy,
  type SkillGroup,
  type SocialProof,
  type TechStack,
  type ToggleSettings,
} from "./schemas";

// Find project root - handle both dev and production paths
// Use current working directory which works correctly in both environments
const projectRoot = process.cwd();
const contentJsonDir = join(projectRoot, "content", "json");
const contentMdxDir = join(projectRoot, "content", "mdx", "projects");

const DEFAULT_TOGGLE_SETTINGS: ToggleSettings = {
  servicesEnabled: false,
  blogEnabled: false,
  testimonialsEnabled: true,
};

type GeneratedCollections = {
  allProfiles?: unknown[];
  allSkillGroups?: unknown[];
  allExperienceItems?: unknown[];
  allEducationEntries?: unknown[];
  allCertifications?: unknown[];
  allSocialProofs?: unknown[];
  allToggleSettings?: unknown[];
  allProjectCaseStudies?: unknown[];
  allTechStacks?: unknown[];
};

const LOAD_HELPER_MESSAGE =
  "Contentlayer data has not been generated. Run `npm run dev` or `npx contentlayer build` after seeding content.";

const loadSourceCollections = (): GeneratedCollections => {
  const readJson = <T>(relativePath: string): T => {
    const filePath = join(contentJsonDir, relativePath);
    return JSON.parse(readFileSync(filePath, "utf-8")) as T;
  };

  const readCollection = <T>(folder: string): T[] => {
    const directory = join(contentJsonDir, folder);
    return readdirSync(directory)
      .filter((file) => file.endsWith(".json"))
      .map((file) => JSON.parse(readFileSync(join(directory, file), "utf-8")) as T);
  };

  const readProjectCaseStudiesFromMdx = (): ProjectCaseStudy[] => {
    try {
      return readdirSync(contentMdxDir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
          const filePath = join(contentMdxDir, file);
          const parsed = matter(readFileSync(filePath, "utf-8"));
          const safeResult = projectCaseStudySchema.safeParse(parsed.data);

          if (!safeResult.success) {
            throw new Error(safeResult.error.message);
          }

          return safeResult.data;
        });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse project MDX frontmatter: ${message}`);
    }
  };

  try {
    return {
      allProfiles: [readJson<Profile>("profile.json")],
      allSkillGroups: readCollection<SkillGroup>("skills"),
      allExperienceItems: readCollection<ExperienceItem>("experience"),
      allEducationEntries: readCollection<EducationItem>("education"),
      allCertifications: readJson<CertificationItem[]>("certifications.json"),
      allSocialProofs: [readJson<SocialProof>("social-proof.json")],
      allToggleSettings: [readJson<ToggleSettings>("toggles.json")],
      allProjectCaseStudies: readProjectCaseStudiesFromMdx(),
      allTechStacks: [readJson<TechStack>("tech-stack.json")],
    } satisfies GeneratedCollections;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load content from source files: ${message}`);
  }
};

const loadGeneratedCollections = (): GeneratedCollections => {
  try {
    return loadSourceCollections();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${LOAD_HELPER_MESSAGE} ${message}`);
  }
};

const parseResultOrThrow = <T>(
  schemaName: string,
  result: SafeParseReturnType<unknown, T>,
): T => {
  if (!result.success) {
    throw new Error(`Invalid ${schemaName} content: ${result.error.message}`);
  }

  return result.data;
};

export const loadProfile = (): Profile => {
  const { allProfiles } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "profile collection",
    profileCollectionSchema.safeParse(allProfiles ?? []),
  );

  return parseResultOrThrow("profile entry", profileSchema.safeParse(collection[0]));
};

export const loadSkillGroups = (): SkillGroup[] => {
  const { allSkillGroups } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "skill group collection",
    skillGroupCollectionSchema.safeParse(allSkillGroups ?? []),
  );

  return collection.map((item) =>
    parseResultOrThrow("skill group", skillGroupSchema.safeParse(item)),
  );
};

export const loadExperienceItems = (): ExperienceItem[] => {
  const { allExperienceItems } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "experience collection",
    experienceCollectionSchema.safeParse(allExperienceItems ?? []),
  );

  return collection.map((item) =>
    parseResultOrThrow("experience item", experienceItemSchema.safeParse(item)),
  );
};

export const loadEducationEntries = (): EducationItem[] => {
  const { allEducationEntries } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "education collection",
    educationCollectionSchema.safeParse(allEducationEntries ?? []),
  );

  return collection.map((item) =>
    parseResultOrThrow("education item", educationItemSchema.safeParse(item)),
  );
};

export const loadCertificationItems = (): CertificationItem[] => {
  const { allCertifications } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "certification collection",
    certificationCollectionSchema.safeParse(allCertifications ?? []),
  );

  return collection.map((item) =>
    parseResultOrThrow("certification item", certificationItemSchema.safeParse(item)),
  );
};

export const loadSocialProof = (): SocialProof => {
  const { allSocialProofs } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "social proof collection",
    socialProofCollectionSchema.safeParse(allSocialProofs ?? []),
  );

  const entries = collection.map((item) =>
    parseResultOrThrow("social proof entry", socialProofSchema.safeParse(item)),
  );

  if (entries.length === 0) {
    throw new Error(
      "At least one social proof entry is required. Add content to content/json/social-proof.json.",
    );
  }

  return entries[0];
};

export const loadTechStack = (): TechStack => {
  const { allTechStacks } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "tech stack collection",
    techStackCollectionSchema.safeParse(allTechStacks ?? []),
  );

  if (collection.length === 0) {
    throw new Error(
      "Tech stack content is missing. Add content to content/json/tech-stack.json.",
    );
  }

  return parseResultOrThrow("tech stack entry", techStackSchema.safeParse(collection[0]));
};

export const loadToggleSettings = (): ToggleSettings => {
  const { allToggleSettings } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "toggle settings collection",
    toggleSettingsCollectionSchema.safeParse(allToggleSettings ?? []),
  );

  if (collection.length === 0) {
    return DEFAULT_TOGGLE_SETTINGS;
  }

  return parseResultOrThrow(
    "toggle settings",
    toggleSettingsSchema.safeParse(collection[0]),
  );
};

export const loadProjectCaseStudies = (): ProjectCaseStudy[] => {
  const { allProjectCaseStudies } = loadGeneratedCollections();
  const collection = parseResultOrThrow(
    "project collection",
    projectCollectionSchema.safeParse(allProjectCaseStudies ?? []),
  );

  return collection
    .map((item) =>
      parseResultOrThrow("project case study", projectCaseStudySchema.safeParse(item)),
    )
    .sort((a, b) => (a.publishedAt > b.publishedAt ? -1 : 1));
};

export const loadSiteContent = () => ({
  profile: loadProfile(),
  skillGroups: loadSkillGroups(),
  experience: loadExperienceItems(),
  education: loadEducationEntries(),
  certifications: loadCertificationItems(),
  socialProof: loadSocialProof(),
  toggleSettings: loadToggleSettings(),
  projects: loadProjectCaseStudies(),
  techStack: loadTechStack(),
});
