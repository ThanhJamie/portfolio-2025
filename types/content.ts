// Content Types
// These types are used for JSON content files and contentlayer

export interface ProfileJson {
  name: string;
  headline: string;
  tagline: string;
  email: string;
  phone?: string;
  location: string;
  availability: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  summary: string;
}

export interface ExperienceJson {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  highlights: string[];
  employmentType?: string;
}

export interface EducationJson {
  institution: string;
  degree: string;
  field: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
  highlights?: string[];
}

export interface SkillJson {
  name: string;
  category: string;
  level?: number;
  icon?: string;
}

export interface SkillCategoryJson {
  category: string;
  icon?: string;
  items: SkillJson[];
}

export interface ProjectJson {
  title: string;
  slug: string;
  summary: string;
  description?: string;
  problem?: string;
  approach?: string;
  role?: string;
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
  thumbnailUrl?: string;
  heroImageUrl?: string;
  techStack: string[];
  outcomes?: Array<{ label: string; value: string }>;
  category: string;
  tags?: string[];
  client?: string;
  timeline?: string;
  featured?: boolean;
}

export interface CertificationJson {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
}

export interface SocialProofJson {
  testimonials?: Array<{
    name: string;
    role: string;
    company: string;
    content: string;
    avatarUrl?: string;
  }>;
  stats?: Array<{
    label: string;
    value: string;
  }>;
}

export interface TogglesJson {
  showTestimonials: boolean;
  showStats: boolean;
  showBlog: boolean;
  showProjects: boolean;
  showContact: boolean;
  maintenanceMode: boolean;
}
