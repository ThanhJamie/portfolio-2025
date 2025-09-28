import { createRequire } from "node:module";

import {
  educationItemSchema,
  experienceItemSchema,
  profileSchema,
  projectCaseStudySchema,
  skillGroupSchema,
  socialProofSchema,
  techStackSchema,
  toggleSettingsSchema,
} from "./lib/contentlayer/schemas";

type ComputedField = {
  type: string;
  resolve: (doc: Record<string, unknown>) => unknown;
};

type DocumentTypeDefinition = {
  name: string;
  filePathPattern: string;
  contentType: "data" | "mdx";
  schema: unknown;
  computedFields?: Record<string, ComputedField>;
};

type ContentlayerSource = {
  defineDocumentType: (factory: () => DocumentTypeDefinition) => unknown;
  makeSource: (config: { contentDirPath: string; documentTypes: unknown[] }) => unknown;
};

const require = createRequire(import.meta.url);

const loadContentlayerSource = (): ContentlayerSource | undefined => {
  try {
    return require("contentlayer/source-files") as ContentlayerSource;
  } catch (error) {
    const isTest = Boolean(process.env.VITEST || process.env.NODE_ENV === "test");

    if (!isTest) {
      throw error instanceof Error
        ? error
        : new Error("Failed to load contentlayer/source-files module");
    }

    return undefined;
  }
};

const contentlayerSource = loadContentlayerSource();

const projectComputedFields: Record<string, ComputedField> = {
  slug: {
    type: "string",
    resolve: (doc) => {
      const data = doc as {
        slug?: unknown;
        _raw?: { flattenedPath?: string };
      };

      const slug =
        typeof data.slug === "string" && data.slug.length > 0 ? data.slug : undefined;
      const fallback = data._raw?.flattenedPath?.split("/").pop() ?? "";
      return slug ?? fallback;
    },
  },
  url: {
    type: "string",
    resolve: (doc) => {
      const data = doc as {
        slug?: unknown;
        _raw?: { flattenedPath?: string };
      };

      const slug =
        typeof data.slug === "string" && data.slug.length > 0
          ? data.slug
          : (data._raw?.flattenedPath?.split("/").pop() ?? "");
      return `/projects/${slug}`;
    },
  },
  flattenedPath: {
    type: "string",
    resolve: (doc) => {
      const data = doc as { _raw?: { flattenedPath?: string } };
      return data._raw?.flattenedPath ?? "";
    },
  },
};

const documentTypeDefinitions: DocumentTypeDefinition[] = [
  {
    name: "Profile",
    filePathPattern: "json/profile.json",
    contentType: "data",
    schema: profileSchema,
  },
  {
    name: "SkillGroup",
    filePathPattern: "json/skills/*.json",
    contentType: "data",
    schema: skillGroupSchema,
  },
  {
    name: "TechStack",
    filePathPattern: "json/tech-stack.json",
    contentType: "data",
    schema: techStackSchema,
  },
  {
    name: "ExperienceItem",
    filePathPattern: "json/experience/*.json",
    contentType: "data",
    schema: experienceItemSchema,
  },
  {
    name: "EducationEntry",
    filePathPattern: "json/education/*.json",
    contentType: "data",
    schema: educationItemSchema,
  },
  {
    name: "SocialProof",
    filePathPattern: "json/social-proof.json",
    contentType: "data",
    schema: socialProofSchema,
  },
  {
    name: "ToggleSettings",
    filePathPattern: "json/toggles.json",
    contentType: "data",
    schema: toggleSettingsSchema,
  },
  {
    name: "ProjectCaseStudy",
    filePathPattern: "mdx/projects/*.mdx",
    contentType: "mdx",
    schema: projectCaseStudySchema,
    computedFields: projectComputedFields,
  },
];

const documentTypes = contentlayerSource
  ? documentTypeDefinitions.map((definition) =>
      contentlayerSource.defineDocumentType(() => definition),
    )
  : documentTypeDefinitions;

const baseConfig = {
  contentDirPath: "content",
  documentTypes,
};

const contentlayerConfig = contentlayerSource?.makeSource
  ? contentlayerSource.makeSource(baseConfig)
  : baseConfig;

export const rawDocumentTypeDefinitions = documentTypeDefinitions;
export default contentlayerConfig;
