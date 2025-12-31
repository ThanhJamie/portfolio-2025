// API Types
// These types are used for API request/response payloads

// Profile API
export interface ProfileCreateInput {
  name: string;
  headline: string;
  tagline: string;
  email: string;
  phone?: string | null;
  location: string;
  availability: string;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
  summary: string;
}

export interface ProfileUpdateInput extends Partial<ProfileCreateInput> {
  id: string;
}

// Experience API
export interface ExperienceCreateInput {
  company: string;
  position: string;
  location?: string | null;
  startDate: string | Date;
  endDate?: string | Date | null;
  isCurrent?: boolean;
  description: string;
  highlights?: string;
  employmentType?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface ExperienceUpdateInput extends Partial<ExperienceCreateInput> {
  id: string;
}

// Education API
export interface EducationCreateInput {
  institution: string;
  degree: string;
  field: string;
  location?: string | null;
  startDate: string | Date;
  endDate?: string | Date | null;
  isCurrent?: boolean;
  gpa?: string | null;
  description?: string;
  highlights?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface EducationUpdateInput extends Partial<EducationCreateInput> {
  id: string;
}

// Skill API
export interface SkillCreateInput {
  name: string;
  category: string;
  level?: number;
  icon?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface SkillUpdateInput extends Partial<SkillCreateInput> {
  id: string;
}

// Project API
export interface ProjectCreateInput {
  title: string;
  slug: string;
  summary: string;
  description?: string;
  problem?: string;
  approach?: string;
  role?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  caseStudyUrl?: string | null;
  thumbnailUrl?: string | null;
  heroImageUrl?: string | null;
  techStack?: string;
  outcomes?: string;
  category?: string;
  tags?: string;
  client?: string | null;
  timeline?: string | null;
  featured?: boolean;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface ProjectUpdateInput extends Partial<ProjectCreateInput> {
  id: string;
}

// Certification API
export interface CertificationCreateInput {
  name: string;
  issuer: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface CertificationUpdateInput extends Partial<CertificationCreateInput> {
  id: string;
}

// Content API
export interface ContentUpdateInput {
  file: string;
  content: unknown;
}

// API Response types
export interface ApiSuccessResponse<T = unknown> {
  data?: T;
  success?: boolean;
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  status?: number;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;
