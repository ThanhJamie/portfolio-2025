/**
 * React-cached hooks for loading content from database
 * These hooks memoize database calls during SSR/SSG
 */

import { cache as reactCache } from "react";

import {
  loadCertificationItems,
  loadEducationEntries,
  loadExperienceItems,
  loadProfile,
  loadSkillGroups,
  loadSocialProof,
  loadTechStack,
  loadToggleSettings,
  loadProjectCaseStudies,
  type EducationItem,
  type ExperienceItem,
  type Profile,
  type CertificationItem,
  type SkillGroup,
  type SocialProof,
  type TechStack,
  type ToggleSettings,
  type ProjectCaseStudy,
} from "./loaders";

// Fallback cache for environments where React cache isn't available
const fallbackCache = <TValue>(fn: () => Promise<TValue>): (() => Promise<TValue>) => {
  let hasValue = false;
  let value: TValue;

  return async () => {
    if (!hasValue) {
      value = await fn();
      hasValue = true;
    }
    return value;
  };
};

const cacheImplementation = typeof reactCache === "function" ? reactCache : fallbackCache;

const cacheResult = <TValue>(fn: () => Promise<TValue>): (() => Promise<TValue>) =>
  cacheImplementation(fn);

// Cached data fetchers
export const getProfile = cacheResult<Profile>(() => loadProfile());
export const getSkillGroups = cacheResult<SkillGroup[]>(() => loadSkillGroups());
export const getExperienceItems = cacheResult<ExperienceItem[]>(() =>
  loadExperienceItems(),
);
export const getEducationItems = cacheResult<EducationItem[]>(() =>
  loadEducationEntries(),
);
export const getCertificationItems = cacheResult<CertificationItem[]>(() =>
  loadCertificationItems(),
);
export const getSocialProof = cacheResult<SocialProof>(() => loadSocialProof());
export const getTechStack = cacheResult<TechStack>(() => loadTechStack());
export const getToggleSettings = cacheResult<ToggleSettings>(() => loadToggleSettings());
export const getProjectCaseStudies = cacheResult<ProjectCaseStudy[]>(() =>
  loadProjectCaseStudies(),
);

// Re-export types for convenience
export type {
  Profile,
  SkillGroup,
  ExperienceItem,
  EducationItem,
  CertificationItem,
  SocialProof,
  TechStack,
  ToggleSettings,
  ProjectCaseStudy,
};
