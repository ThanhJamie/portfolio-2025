/**
 * React-cached hooks for loading content from database
 * These hooks memoize database calls during SSR/SSG
 */

import { cache } from "react";

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

// React.cache() memoizes within a single request lifecycle
// Combined with revalidatePath from admin routes, this ensures:
// - Multiple calls in same request share one DB query
// - Admin updates trigger fresh data on next request

// Cached data fetchers
export const getProfile = cache(loadProfile);
export const getSkillGroups = cache(loadSkillGroups);
export const getExperienceItems = cache(loadExperienceItems);
export const getEducationItems = cache(loadEducationEntries);
export const getCertificationItems = cache(loadCertificationItems);
export const getSocialProof = cache(loadSocialProof);
export const getTechStack = cache(loadTechStack);
export const getToggleSettings = cache(loadToggleSettings);
export const getProjectCaseStudies = cache(loadProjectCaseStudies);

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
