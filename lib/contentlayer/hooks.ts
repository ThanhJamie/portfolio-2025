import { cache as reactCache } from "react";

import {
  loadCertificationItems,
  loadEducationEntries,
  loadExperienceItems,
  loadProfile,
  loadProjectCaseStudies,
  loadSkillGroups,
  loadSocialProof,
  loadToggleSettings,
  loadTechStack,
} from "./loaders";
import type {
  EducationItem,
  ExperienceItem,
  Profile,
  ProjectCaseStudy,
  CertificationItem,
  SkillGroup,
  SocialProof,
  TechStack,
  ToggleSettings,
} from "./schemas";

const fallbackCache = <TValue>(fn: () => TValue): (() => TValue) => {
  let hasValue = false;
  let value: TValue;

  return () => {
    if (!hasValue) {
      value = fn();
      hasValue = true;
    }
    return value;
  };
};

const cacheImplementation = typeof reactCache === "function" ? reactCache : fallbackCache;

const cacheResult = <TValue>(fn: () => TValue): (() => TValue) => cacheImplementation(fn);

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
export const getToggleSettings = cacheResult<ToggleSettings>(() => loadToggleSettings());
export const getTechStack = cacheResult<TechStack>(() => loadTechStack());
export const getProjects = cacheResult<ProjectCaseStudy[]>(() =>
  loadProjectCaseStudies(),
);

export const getSiteEssentials = cacheResult(() => ({
  profile: getProfile(),
  socialProof: getSocialProof(),
  toggles: getToggleSettings(),
  techStack: getTechStack(),
}));
