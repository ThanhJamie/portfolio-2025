import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

import { sanitizeText } from "./utils";

// Don't register custom fonts - use built-in PDF fonts to avoid encoding issues
// Built-in fonts: Helvetica, Times-Roman, Courier

// Modern IT-style color palette - Optimized for 3-page layout
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
  },
  // Header Section - Compact
  header: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottom: "2 solid #3b82f6",
  },
  name: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 3,
  },
  headline: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
    marginBottom: 6,
  },
  contactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  contactItem: {
    fontSize: 8,
    color: "#64748b",
  },
  link: {
    color: "#3b82f6",
    textDecoration: "none",
  },
  // Section Styles - Optimized spacing for better page distribution
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 5,
    paddingBottom: 2,
    borderBottom: "1 solid #e2e8f0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Summary Section - Condensed
  summary: {
    fontSize: 8.5,
    lineHeight: 1.3,
    color: "#334155",
    marginBottom: 5,
  },
  // Experience Section - Compact
  experienceItem: {
    marginBottom: 8,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  company: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
  },
  jobDate: {
    fontSize: 8,
    color: "#64748b",
  },
  location: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 2,
  },
  jobDescription: {
    fontSize: 8.5,
    lineHeight: 1.25,
    color: "#475569",
    marginBottom: 2,
  },
  highlightsList: {
    marginTop: 2,
  },
  highlight: {
    fontSize: 8.5,
    lineHeight: 1.25,
    color: "#475569",
    marginBottom: 2,
    paddingLeft: 10,
  },
  bullet: {
    position: "absolute",
    left: 0,
    color: "#3b82f6",
  },
  // Skills Section - Compact badge layout
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 5,
  },
  skillGroup: {
    marginBottom: 6,
  },
  skillGroupTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 3,
  },
  skillGroupSummary: {
    fontSize: 8,
    lineHeight: 1.3,
    color: "#64748b",
    marginBottom: 4,
    fontStyle: "italic",
  },
  // Frontend badge style - Smaller
  frontendBadge: {
    fontSize: 7.5,
    color: "#1e40af",
    backgroundColor: "#dbeafe",
    padding: "3 7",
    borderRadius: 2,
    border: "0.5 solid #93c5fd",
    fontFamily: "Helvetica-Bold",
  },
  // Backend/Development badge style - Smaller
  backendBadge: {
    fontSize: 7.5,
    color: "#166534",
    backgroundColor: "#dcfce7",
    padding: "3 7",
    borderRadius: 2,
    border: "0.5 solid #86efac",
    fontFamily: "Helvetica-Bold",
  },
  // DevOps/Deployment badge style - Smaller
  devopsBadge: {
    fontSize: 7.5,
    color: "#9333ea",
    backgroundColor: "#f3e8ff",
    padding: "3 7",
    borderRadius: 2,
    border: "0.5 solid #d8b4fe",
    fontFamily: "Helvetica-Bold",
  },
  // Default badge style - Smaller
  defaultBadge: {
    fontSize: 7.5,
    color: "#1e40af",
    backgroundColor: "#dbeafe",
    padding: "3 7",
    borderRadius: 2,
    border: "0.5 solid #93c5fd",
    fontFamily: "Helvetica-Bold",
  },
  // Education Section - Compact
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  institution: {
    fontSize: 8.5,
    color: "#3b82f6",
    marginBottom: 2,
  },
  educationDetails: {
    fontSize: 8,
    color: "#64748b",
  },
  // Focus Areas - Compact
  focusGrid: {
    flexDirection: "column",
    gap: 3,
  },
  focusItem: {
    fontSize: 8.5,
    color: "#334155",
    paddingLeft: 10,
    marginBottom: 2,
    position: "relative",
    lineHeight: 1.3,
  },
  // Key Achievements / Metrics - Compact
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 5,
  },
  metricCard: {
    flex: 1,
    minWidth: "30%",
    padding: 6,
    backgroundColor: "#f8fafc",
    borderRadius: 3,
    border: "0.5 solid #e2e8f0",
  },
  metricValue: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  metricDescription: {
    fontSize: 7.5,
    lineHeight: 1.2,
    color: "#64748b",
  },
  // Certifications - Very compact for better page distribution
  certificationItem: {
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  certificationTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    flex: 1,
  },
  certificationDate: {
    fontSize: 7.5,
    color: "#64748b",
  },
  // Recent Wins - Compact
  winItem: {
    fontSize: 8.5,
    lineHeight: 1.3,
    color: "#334155",
    paddingLeft: 10,
    marginBottom: 3,
    position: "relative",
  },
  // Tech Stack Details - Removed (no longer using detailed view)
  techCategory: {
    marginBottom: 8,
  },
  techCategoryTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
    marginBottom: 4,
  },
  techItem: {
    marginBottom: 4,
    flexDirection: "row",
  },
  techName: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    width: 120,
  },
  techSummary: {
    fontSize: 8,
    lineHeight: 1.2,
    color: "#64748b",
    flex: 1,
  },
  // Projects - Compact
  projectItem: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#f8fafc",
    borderRadius: 3,
    border: "0.5 solid #e2e8f0",
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  projectTitle: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  projectMeta: {
    fontSize: 7.5,
    color: "#64748b",
    marginBottom: 2,
  },
  projectSummary: {
    fontSize: 8,
    lineHeight: 1.25,
    color: "#334155",
    marginBottom: 3,
  },
  projectStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginBottom: 3,
  },
  projectTech: {
    fontSize: 7,
    color: "#7c3aed",
    backgroundColor: "#f3e8ff",
    padding: "2 5",
    borderRadius: 2,
    border: "0.5 solid #d8b4fe",
  },
  projectOutcomes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  projectOutcome: {
    fontSize: 7.5,
  },
  projectOutcomeValue: {
    fontFamily: "Helvetica-Bold",
    color: "#3b82f6",
  },
});

interface CVData {
  profile: {
    name: string;
    headline: string;
    location: string;
    primaryEmail: string;
    tagline: string;
    story: string[];
    focusAreas: string[];
    socialLinks: Array<{ label: string; href: string }>;
    recentWins?: string[];
  };
  experience: Array<{
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    credential: string;
    yearCompleted: string;
    location: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
    summary?: string;
  }>;
  techStack?: {
    frontend?: Array<{ name: string; summary: string }>;
    backend?: Array<{ name: string; summary: string }>;
    ai_and_ml?: Array<{ name: string; summary: string }>;
    tools_and_devops?: Array<{ name: string; summary: string }>;
  };
  projects?: Array<{
    title: string;
    client: string;
    role: string;
    timeline: string;
    summary: string;
    stack: string[];
    outcomes: Array<{ label: string; value: string }>;
  }>;
  certifications?: Array<{
    title: string;
    time: string;
    link?: string;
  }>;
  metrics?: Array<{
    label: string;
    value: string;
    description: string;
  }>;
}

export function CVTemplate({ data }: { data: CVData }) {
  const formatDate = (dateString: string) => {
    if (dateString.toLowerCase() === "present") return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Determine badge style based on skill category
  const getBadgeStyle = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes("frontend") || lowerCategory.includes("ui")) {
      return styles.frontendBadge;
    } else if (
      lowerCategory.includes("backend") ||
      lowerCategory.includes("development") ||
      lowerCategory.includes("integration")
    ) {
      return styles.backendBadge;
    } else if (
      lowerCategory.includes("deployment") ||
      lowerCategory.includes("devops") ||
      lowerCategory.includes("operations")
    ) {
      return styles.devopsBadge;
    }
    return styles.defaultBadge;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{sanitizeText(data.profile.name)}</Text>
          <Text style={styles.headline}>{sanitizeText(data.profile.headline)}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>
              Location: {sanitizeText(data.profile.location)}
            </Text>
            <Link
              src="mailto:chithanhso10@gmail.com"
              style={[styles.contactItem, styles.link]}
            >
              chithanhso10@gmail.com
            </Link>
            <Link
              src="mailto:thanhjamieai@gmail.com"
              style={[styles.contactItem, styles.link]}
            >
              thanhjamieai@gmail.com
            </Link>
            <Link
              src="https://www.linkedin.com/in/thanhjamieai/"
              style={[styles.contactItem, styles.link]}
            >
              LinkedIn: thanhjamieai
            </Link>
            {data.profile.socialLinks
              .filter((link) => !link.label.toLowerCase().includes("linkedin"))
              .map((link) => (
                <Link
                  key={link.label}
                  src={link.href}
                  style={[styles.contactItem, styles.link]}
                >
                  {sanitizeText(link.label)}
                </Link>
              ))}
          </View>
        </View>

        {/* Professional Summary - Condensed */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{sanitizeText(data.profile.tagline)}</Text>
          {/* Limit to first paragraph for space efficiency */}
          {data.profile.story.slice(0, 1).map((paragraph, idx) => (
            <Text key={idx} style={styles.summary}>
              {sanitizeText(paragraph)}
            </Text>
          ))}
        </View>

        {/* Core Competencies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Core Competencies</Text>
          <View style={styles.focusGrid}>
            {data.profile.focusAreas.map((area, idx) => (
              <View key={idx} style={styles.focusItem}>
                <Text style={styles.bullet}>•</Text>
                <Text>{sanitizeText(area)}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Key Achievements - Top 3 metrics only */}
        {data.metrics && data.metrics.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Achievements</Text>
            <View style={styles.metricsGrid}>
              {data.metrics.slice(0, 3).map((metric, idx) => (
                <View key={idx} style={styles.metricCard}>
                  <Text style={styles.metricValue}>{sanitizeText(metric.value)}</Text>
                  <Text style={styles.metricLabel}>{sanitizeText(metric.label)}</Text>
                  <Text style={styles.metricDescription}>
                    {sanitizeText(metric.description)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Recent Wins - Top 5 only */}
        {data.profile.recentWins && data.profile.recentWins.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Wins</Text>
            {data.profile.recentWins.slice(0, 5).map((win, idx) => (
              <View key={idx} style={styles.winItem}>
                <Text style={styles.bullet}>✓</Text>
                <Text>{sanitizeText(win)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Professional Experience - Limit highlights to 3 per job */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((job, idx) => (
            <View key={idx} style={styles.experienceItem}>
              <View style={styles.jobHeader}>
                <View>
                  <Text style={styles.jobTitle}>{sanitizeText(job.role)}</Text>
                  <Text style={styles.company}>{sanitizeText(job.company)}</Text>
                </View>
                <Text style={styles.jobDate}>
                  {formatDate(job.startDate)} - {formatDate(job.endDate)}
                </Text>
              </View>
              <Text style={styles.location}>{sanitizeText(job.location)}</Text>
              <Text style={styles.jobDescription}>{sanitizeText(job.summary)}</Text>
              <View style={styles.highlightsList}>
                {job.highlights.slice(0, 3).map((highlight, hIdx) => (
                  <View key={hIdx} style={styles.highlight}>
                    <Text style={styles.bullet}>•</Text>
                    <Text>{sanitizeText(highlight)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Technical Skills & Technologies - Combined */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills & Technologies</Text>

          {/* Skills from skill groups */}
          {data.skills.length > 0 &&
            data.skills.map((skillGroup, idx) => (
              <View key={idx} style={styles.skillGroup}>
                <Text style={styles.skillGroupTitle}>
                  {sanitizeText(skillGroup.category)}
                </Text>
                <View style={styles.skillsContainer}>
                  {skillGroup.items.map((skill, sIdx) => (
                    <Text key={sIdx} style={getBadgeStyle(skillGroup.category)}>
                      {sanitizeText(skill)}
                    </Text>
                  ))}
                </View>
              </View>
            ))}

          {/* Tech stack categories */}
          {data.techStack && (
            <>
              {data.techStack.frontend && data.techStack.frontend.length > 0 && (
                <View style={styles.skillGroup}>
                  <Text style={styles.skillGroupTitle}>Frontend & UI</Text>
                  <View style={styles.skillsContainer}>
                    {data.techStack.frontend.map((tech, idx) => (
                      <Text key={idx} style={styles.frontendBadge}>
                        {sanitizeText(tech.name)}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {data.techStack.backend && data.techStack.backend.length > 0 && (
                <View style={styles.skillGroup}>
                  <Text style={styles.skillGroupTitle}>Backend & Database</Text>
                  <View style={styles.skillsContainer}>
                    {data.techStack.backend.map((tech, idx) => (
                      <Text key={idx} style={styles.backendBadge}>
                        {sanitizeText(tech.name)}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {data.techStack.ai_and_ml && data.techStack.ai_and_ml.length > 0 && (
                <View style={styles.skillGroup}>
                  <Text style={styles.skillGroupTitle}>AI & Machine Learning</Text>
                  <View style={styles.skillsContainer}>
                    {data.techStack.ai_and_ml.map((tech, idx) => (
                      <Text key={idx} style={styles.defaultBadge}>
                        {sanitizeText(tech.name)}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {data.techStack.tools_and_devops &&
                data.techStack.tools_and_devops.length > 0 && (
                  <View style={styles.skillGroup}>
                    <Text style={styles.skillGroupTitle}>Tools & DevOps</Text>
                    <View style={styles.skillsContainer}>
                      {data.techStack.tools_and_devops.map((tech, idx) => (
                        <Text key={idx} style={styles.devopsBadge}>
                          {sanitizeText(tech.name)}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
            </>
          )}
        </View>

        {/* Featured Projects - Top 3 only */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Projects</Text>
            {data.projects.slice(0, 3).map((project, idx) => (
              <View key={idx} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectTitle}>{sanitizeText(project.title)}</Text>
                </View>
                <Text style={styles.projectMeta}>
                  {sanitizeText(project.client)} • {sanitizeText(project.role)} •{" "}
                  {sanitizeText(project.timeline)}
                </Text>
                <Text style={styles.projectSummary}>{sanitizeText(project.summary)}</Text>
                <View style={styles.projectStack}>
                  {project.stack.slice(0, 8).map((tech, tIdx) => (
                    <Text key={tIdx} style={styles.projectTech}>
                      {sanitizeText(tech)}
                    </Text>
                  ))}
                </View>
                {project.outcomes && project.outcomes.length > 0 && (
                  <View style={styles.projectOutcomes}>
                    {project.outcomes.slice(0, 3).map((outcome, oIdx) => (
                      <Text key={oIdx} style={styles.projectOutcome}>
                        <Text style={styles.projectOutcomeValue}>
                          {sanitizeText(outcome.value)}
                        </Text>{" "}
                        {sanitizeText(outcome.label)}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={styles.educationItem}>
              <Text style={styles.degree}>{sanitizeText(edu.credential)}</Text>
              <Text style={styles.institution}>{sanitizeText(edu.institution)}</Text>
              <Text style={styles.educationDetails}>
                {sanitizeText(edu.location)} - Graduated {sanitizeText(edu.yearCompleted)}
              </Text>
            </View>
          ))}
        </View>

        {/* Certifications - Show all courses */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Training</Text>
            {data.certifications.map((cert, idx) => (
              <View key={idx} style={styles.certificationItem}>
                <Text style={styles.certificationTitle}>{sanitizeText(cert.title)}</Text>
                <Text style={styles.certificationDate}>{sanitizeText(cert.time)}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
