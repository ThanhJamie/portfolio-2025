// CV/Resume Types
// These types are used for PDF CV generation

export interface CVProfile {
  name: string;
  headline: string;
  tagline: string;
  email: string;
  phone: string | null;
  location: string;
  summary: string;
  linkedinUrl: string | null;
  githubUrl: string | null;
  websiteUrl: string | null;
}

export interface CVExperience {
  company: string;
  position: string;
  location: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  employmentType: string;
}

export interface CVEducation {
  institution: string;
  degree: string;
  field: string;
  location: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  isCurrent: boolean;
  gpa: string | null;
}

export interface CVSkillCategory {
  category: string;
  items: string[];
}

export interface CVProject {
  title: string;
  role: string;
  client: string | null;
  timeline: string | null;
  summary: string;
  techStack: string[];
  outcomes: Array<{ label: string; value: string }>;
  liveUrl: string | null;
  githubUrl: string | null;
}

export interface CVCertification {
  name: string;
  issuer: string;
  issueDate: Date | string;
  credentialUrl: string | null;
}

export interface CVData {
  profile: CVProfile;
  experiences: CVExperience[];
  education: CVEducation[];
  skills: CVSkillCategory[];
  projects: CVProject[];
  certifications: CVCertification[];
}

// Props for CV template components
export interface CVTemplateProps {
  data: CVData;
}
