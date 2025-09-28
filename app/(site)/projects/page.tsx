"use client";

import { useMemo, useState } from "react";

import { ProjectFilters } from "@/components/sections/projects/ProjectFilters";
import { ProjectList } from "@/components/sections/projects/ProjectList";
import type {
  Project,
  ProjectDiscipline,
  ProjectFocus,
} from "@/components/sections/projects/types";

const projects: Project[] = [
  {
    id: "aurora-growth-suite",
    title: "Aurora Growth Suite Dashboard",
    client: "Aurora Labs",
    timeline: "2023 – Present",
    discipline: "Product Design",
    focus: "SaaS",
    summary:
      "Orchestrated a cross-functional redesign of Aurora's analytics hub to align trial activation, onboarding flows, and executive reporting across regions.",
    problem:
      "Teams relied on fragmented spreadsheets to monitor growth experiments, making it impossible to compare cohort health or react to underperforming funnels in real-time.",
    approach: [
      "Facilitated discovery sprints with product, data, and revenue leads to map opportunity spaces",
      "Introduced a modular design system that unified widget patterns across responsive breakpoints",
      "Instrumented Playwright + Axe regression tests to guarantee accessible, trustworthy dashboards",
    ],
    role: "Lead Product Designer",
    stack: ["Figma Tokens", "Next.js", "Storybook", "Playwright"],
    outcomes: [
      { label: "Activation", value: "+28% trial-to-paid conversion within two quarters" },
      {
        label: "Iteration velocity",
        value: "Reduced design-to-dev handoff from 3 weeks to 10 days",
      },
      { label: "Support load", value: "Cut analytics support tickets by 41%" },
    ],
    thumbnail: "AG",
  },
  {
    id: "nexa-insights-platform",
    title: "Nexa Insights Platform Migration",
    client: "Nexa Growth",
    timeline: "2020 – 2023",
    discipline: "Frontend Engineering",
    focus: "SaaS",
    summary:
      "Rebuilt a legacy React analytics experience into a resilient Next.js platform with real-time collaboration and offline caching for field teams.",
    problem:
      "The previous single-page app shipped unoptimized bundles exceeding 1MB, causing timeouts for global teams with inconsistent connectivity.",
    approach: [
      "Introduced edge-rendered route groups with streaming to prioritize above-the-fold metrics",
      "Codified accessibility guardrails with linting, Vitest, and Playwright scenarios per funnel",
      "Embedded analytics pipeline governance ensuring experiment flags rolled out safely",
    ],
    role: "Senior Frontend Engineer",
    stack: ["Next.js", "TypeScript", "Vercel", "Turbopack"],
    outcomes: [
      { label: "LCP", value: "Improved median LCP from 4.6s to 1.8s" },
      { label: "Reliability", value: "99.95% uptime across 14 markets" },
      {
        label: "Collaboration",
        value: "Enabled simultaneous editing for distributed analysts",
      },
    ],
    thumbnail: "NX",
  },
  {
    id: "velocity-design-system",
    title: "Velocity Multibrand Design System",
    client: "Vertex Commerce",
    timeline: "2022",
    discipline: "Design Systems",
    focus: "Growth",
    summary:
      "Established a token-driven design system powering five ecommerce brands while enabling localized experimentation without sacrificing consistency.",
    problem:
      "Brand teams reinvented UI patterns for each campaign, ballooning design debt and creating accessibility violations across storefronts.",
    approach: [
      "Audited legacy components and prioritized remediation using Axe + manual keyboard testing",
      "Implemented theming architecture with style dictionary and shadcn/ui guardrails",
      "Launched contributor playbook with scorecards tracking adoption and debt paydown",
    ],
    role: "Principal Product Designer",
    stack: ["Figma", "Style Dictionary", "Storybook", "Chromatic"],
    outcomes: [
      {
        label: "Adoption",
        value: "93% component adoption across five brands in six months",
      },
      { label: "Accessibility", value: "Resolved 180+ WCAG issues before BFCM launch" },
      { label: "Velocity", value: "Cut new page creation time from 8 hrs to 2.5 hrs" },
    ],
    thumbnail: "VD",
  },
  {
    id: "flux-payments-experience",
    title: "Flux Payments Trust Rebuild",
    client: "Flux Pay",
    timeline: "2021",
    discipline: "Product Design",
    focus: "Fintech",
    summary:
      "Redesigned the dispute journey and onboarding orchestration for a fintech scale-up balancing compliance, clarity, and conversion.",
    problem:
      "Merchants abandoned onboarding when faced with compliance requests, leading to stalled revenue and high support interventions.",
    approach: [
      "Mapped regulatory checkpoints with legal & risk teams to craft clearer guidance",
      "Prototype-tested progressive disclosure flows with high-risk segments",
      "Integrated privacy-friendly analytics with Supabase logging to monitor funnel friction and iterate quickly",
    ],
    role: "Product Designer",
    stack: ["Figma", "Maze", "Amplitude", "Supabase"],
    outcomes: [
      { label: "Onboarding completion", value: "+34% completed KYB flows" },
      { label: "Support", value: "Reduced dispute-related tickets by 27%" },
      {
        label: "Compliance",
        value: "Achieved regulator sign-off without slowing launch",
      },
    ],
    thumbnail: "FP",
  },
  {
    id: "northwind-commerce-refresh",
    title: "Northwind Commerce Replatform",
    client: "Northwind Collective",
    timeline: "2019 – 2020",
    discipline: "Frontend Engineering",
    focus: "Ecommerce",
    summary:
      "Guided the migration of a monolithic ecommerce stack onto Next.js with edge cache strategies and localized content authoring.",
    problem:
      "The legacy platform delivered inconsistent international experiences and lagged in merchandising agility, hurting seasonal revenue.",
    approach: [
      "Implemented ISR with smart cache busting to keep category pages fresh under heavy traffic",
      "Created localization guardrails backed by Contentlayer and translation glossaries",
      "Instrumented Lighthouse CI budgets to enforce performance regressions in CI",
    ],
    role: "Lead Frontend Engineer",
    stack: ["Next.js", "Contentlayer", "Tailwind CSS", "Vercel"],
    outcomes: [
      { label: "Revenue", value: "+19% seasonal revenue lift year-over-year" },
      { label: "Content velocity", value: "Reduced campaign launch time by 60%" },
      { label: "Performance", value: "Met sub-2s LCP across 8 locales" },
    ],
    thumbnail: "NC",
  },
  {
    id: "lumen-experimentation-ops",
    title: "Lumen Experimentation Ops",
    client: "Lumen Analytics",
    timeline: "2018",
    discipline: "Design Systems",
    focus: "Growth",
    summary:
      "Built experimentation operations tooling pairing qualitative insights with experimentation guardrails for a growth-stage SaaS platform.",
    problem:
      "Experiment learnings scattered across docs and decks made it impossible to replicate wins or avoid past pitfalls.",
    approach: [
      "Centralized discovery insights into a searchable library with storytelling templates",
      "Codified success metrics dashboards connecting qualitative clips to quantitative deltas",
      "Rolled out training for PMs/PMMs to design ethical, inclusive experiments",
    ],
    role: "Product Design Lead",
    stack: ["Miro", "Figma", "Notion", "Supabase"],
    outcomes: [
      {
        label: "Experiment cadence",
        value: "Scaled from 4 to 12 experiments per quarter",
      },
      {
        label: "Knowledge retention",
        value: "80% of tests now documented with reusable playbooks",
      },
      {
        label: "Team confidence",
        value: "Team NPS for experimentation practice jumped to 9.1",
      },
    ],
    thumbnail: "LM",
  },
];

export default function ProjectsPage() {
  const [discipline, setDiscipline] = useState<ProjectDiscipline>("All");
  const [focus, setFocus] = useState<ProjectFocus>("All");
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const disciplineMatch = discipline === "All" || project.discipline === discipline;
      const focusMatch = focus === "All" || project.focus === focus;
      return disciplineMatch && focusMatch;
    });
  }, [discipline, focus]);

  return (
    <div className="space-y-12 pb-24">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
          Projects
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Case studies & outcomes
        </h1>
        <p className="max-w-3xl text-base text-muted-foreground">
          A curated selection of end-to-end initiatives spanning product discovery, design
          systems, and frontend engineering. Each engagement highlights collaboration
          models, inclusive processes, and measurable business impact.
        </p>
      </header>

      <ProjectFilters
        discipline={discipline}
        focus={focus}
        onDisciplineChange={setDiscipline}
        onFocusChange={setFocus}
      />

      <ProjectList projects={filteredProjects} />
    </div>
  );
}
