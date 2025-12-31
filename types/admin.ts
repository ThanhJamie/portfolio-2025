// Admin Panel Types
// These types are used in the admin panel for CRUD operations

export interface Profile {
  id: string;
  name: string;
  headline: string;
  tagline: string;
  email: string;
  phone: string | null;
  location: string;
  availability: string;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
  summary: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
  highlights: string;
  employmentType: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  gpa: string | null;
  description: string;
  highlights: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  problem: string;
  approach: string;
  role: string;
  liveUrl: string | null;
  githubUrl: string | null;
  caseStudyUrl: string | null;
  thumbnailUrl: string | null;
  heroImageUrl: string | null;
  techStack: string;
  outcomes: string;
  category: string;
  tags: string;
  client: string | null;
  timeline: string | null;
  featured: boolean;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  description: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Metric {
  id: string;
  label: string;
  value: string;
  description: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Partial types for creating new items (without id)
export type NewExperience = Omit<Experience, "id" | "createdAt" | "updatedAt">;
export type NewEducation = Omit<Education, "id" | "createdAt" | "updatedAt">;
export type NewSkill = Omit<Skill, "id" | "createdAt" | "updatedAt">;
export type NewProject = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type NewCertification = Omit<Certification, "id" | "createdAt" | "updatedAt">;
export type NewMetric = Omit<Metric, "id" | "createdAt" | "updatedAt">;

// Union type for all editable items - allow Record for flexibility in admin panel
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EditableItem = Record<string, any>;

// Tab type for admin panel navigation (aliased for backwards compatibility)
export type AdminTab =
  | "profile"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "metrics";

// Alias for backwards compatibility
export type Tab = AdminTab;

// Message type for notifications
export interface AdminMessage {
  type: "success" | "error";
  text: string;
}
