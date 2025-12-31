// Admin API shared types
// These replace Prisma namespace types for Prisma 7 compatibility
// Using Record<string, unknown> for flexibility with Prisma's generated types

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminCreateInput = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AdminUpdateInput = Record<string, any>;

export interface EducationInput {
  institution: string;
  degree: string;
  field: string;
  location?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  isCurrent?: boolean;
  gpa?: string | null;
  description?: string;
  highlights?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface ExperienceInput {
  company: string;
  position: string;
  location?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  isCurrent?: boolean;
  description?: string;
  highlights?: string;
  employmentType?: string;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface ProfileInput {
  name: string;
  headline: string;
  tagline?: string;
  email: string;
  phone?: string | null;
  location?: string;
  availability?: string;
  avatarUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  websiteUrl?: string | null;
  summary?: string;
}

export interface ProjectInput {
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  problem?: string;
  approach?: string;
  role?: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  caseStudyUrl?: string | null;
  thumbnailUrl?: string | null;
  heroImageUrl?: string | null;
  gallery?: string;
  techStack?: string;
  outcomes?: string;
  category?: string;
  tags?: string;
  client?: string | null;
  timeline?: string | null;
  featured?: boolean;
  publishedAt?: Date | string | null;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface SkillInput {
  name: string;
  category: string;
  level?: number;
  icon?: string | null;
  sortOrder?: number;
  isVisible?: boolean;
}

export interface CertificationInput {
  name: string;
  issuer: string;
  issueDate: Date | string;
  expiryDate?: Date | string | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  description?: string;
  sortOrder?: number;
  isVisible?: boolean;
}
