export type ProjectDiscipline =
  | "All"
  | "Full-Stack Developer"
  | "Frontend Developer"
  | "Backend/AI Developer"
  | "Data/AI Engineer";

export type ProjectFocus =
  | "All"
  | "AI Integration"
  | "Machine Learning"
  | "Full-Stack"
  | "E-commerce";

export interface ProjectOutcome {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  timeline: string;
  discipline: Exclude<ProjectDiscipline, "All">;
  focus: Exclude<ProjectFocus, "All">;
  summary: string;
  problem: string;
  approach: string[];
  role: string;
  stack: string[];
  outcomes: ProjectOutcome[];
  thumbnail: string;
}
