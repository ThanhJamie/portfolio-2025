export type ProjectDiscipline =
  | "All"
  | "Product Design"
  | "Design Systems"
  | "Frontend Engineering";
export type ProjectFocus = "All" | "SaaS" | "Fintech" | "Growth" | "Ecommerce";

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
