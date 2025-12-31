import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { sanitizeText } from "./utils";
import type { CVData } from "@/types/cv";

// Re-export for convenience
export type { CVData };

// Modern IT-style color palette
const styles = StyleSheet.create({
  page: {
    padding: 35,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
  },
  // Header Section
  header: {
    marginBottom: 15,
    paddingBottom: 12,
    borderBottom: "2 solid #2563eb",
  },
  name: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  headline: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 6,
  },
  contactItem: {
    fontSize: 8.5,
    color: "#64748b",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
  },
  // Section Styles
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "1 solid #e2e8f0",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  // Summary
  summary: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#334155",
    marginBottom: 6,
  },
  // Experience
  experienceItem: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  company: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
  },
  jobMeta: {
    alignItems: "flex-end",
  },
  jobDate: {
    fontSize: 8,
    color: "#64748b",
  },
  location: {
    fontSize: 8,
    color: "#94a3b8",
  },
  description: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#475569",
    marginTop: 4,
    marginBottom: 4,
  },
  bulletList: {
    marginTop: 4,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 2,
  },
  bullet: {
    width: 12,
    fontSize: 8,
    color: "#2563eb",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#475569",
  },
  // Skills
  skillsContainer: {
    marginBottom: 10,
  },
  skillCategory: {
    marginBottom: 8,
  },
  skillCategoryTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  skillBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skillBadge: {
    fontSize: 8,
    color: "#1e40af",
    backgroundColor: "#dbeafe",
    padding: "3 8",
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
  },
  skillBadgeBackend: {
    fontSize: 8,
    color: "#166534",
    backgroundColor: "#dcfce7",
    padding: "3 8",
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
  },
  skillBadgeAI: {
    fontSize: 8,
    color: "#9333ea",
    backgroundColor: "#f3e8ff",
    padding: "3 8",
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
  },
  skillBadgeDevOps: {
    fontSize: 8,
    color: "#ea580c",
    backgroundColor: "#ffedd5",
    padding: "3 8",
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
  },
  // Education
  educationItem: {
    marginBottom: 10,
  },
  degree: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  institution: {
    fontSize: 9,
    color: "#2563eb",
    marginTop: 2,
  },
  eduMeta: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  // Projects
  projectItem: {
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  projectRole: {
    fontSize: 8,
    color: "#64748b",
    marginTop: 2,
  },
  projectSummary: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#475569",
    marginTop: 4,
  },
  projectTech: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 6,
  },
  techBadge: {
    fontSize: 7,
    color: "#475569",
    backgroundColor: "#f1f5f9",
    padding: "2 6",
    borderRadius: 2,
  },
  projectOutcomes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  outcomeItem: {
    flexDirection: "row",
    gap: 4,
  },
  outcomeLabel: {
    fontSize: 7,
    color: "#64748b",
  },
  outcomeValue: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#2563eb",
  },
  // Certifications
  certItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  certName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    flex: 1,
  },
  certIssuer: {
    fontSize: 8,
    color: "#64748b",
  },
  certDate: {
    fontSize: 8,
    color: "#94a3b8",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 20,
    left: 35,
    right: 35,
    borderTop: "1 solid #e2e8f0",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#94a3b8",
  },
  pageNumber: {
    fontSize: 7,
    color: "#94a3b8",
  },
});

// Format date helper
function formatDate(date: Date | string | null, isCurrent: boolean = false): string {
  if (isCurrent) return "Present";
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Get badge style based on category
function getSkillBadgeStyle(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("frontend") || cat.includes("front")) return styles.skillBadge;
  if (cat.includes("backend") || cat.includes("back") || cat.includes("database"))
    return styles.skillBadgeBackend;
  if (cat.includes("ai") || cat.includes("ml") || cat.includes("machine"))
    return styles.skillBadgeAI;
  if (cat.includes("devops") || cat.includes("tools") || cat.includes("cloud"))
    return styles.skillBadgeDevOps;
  return styles.skillBadge;
}

export function CVTemplateFromDB({ data }: { data: CVData }) {
  const { profile, experiences, education, skills, projects, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{sanitizeText(profile.name)}</Text>
          <Text style={styles.headline}>{sanitizeText(profile.headline)}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>📧 {profile.email}</Text>
            {profile.phone && <Text style={styles.contactItem}>📱 {profile.phone}</Text>}
            <Text style={styles.contactItem}>📍 {sanitizeText(profile.location)}</Text>
            {profile.linkedinUrl && (
              <Link src={profile.linkedinUrl} style={styles.link}>
                <Text style={styles.contactItem}>LinkedIn</Text>
              </Link>
            )}
            {profile.githubUrl && (
              <Link src={profile.githubUrl} style={styles.link}>
                <Text style={styles.contactItem}>GitHub</Text>
              </Link>
            )}
            {profile.websiteUrl && (
              <Link src={profile.websiteUrl} style={styles.link}>
                <Text style={styles.contactItem}>Portfolio</Text>
              </Link>
            )}
          </View>
        </View>

        {/* Summary */}
        {profile.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{sanitizeText(profile.summary)}</Text>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((group, i) => (
                <View key={i} style={styles.skillCategory}>
                  <Text style={styles.skillCategoryTitle}>{group.category}</Text>
                  <View style={styles.skillBadges}>
                    {group.items.map((skill, j) => (
                      <Text key={j} style={getSkillBadgeStyle(group.category)}>
                        {sanitizeText(skill)}
                      </Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experiences.map((exp, i) => (
              <View key={i} style={styles.experienceItem}>
                <View style={styles.jobHeader}>
                  <View>
                    <Text style={styles.jobTitle}>{sanitizeText(exp.position)}</Text>
                    <Text style={styles.company}>{sanitizeText(exp.company)}</Text>
                  </View>
                  <View style={styles.jobMeta}>
                    <Text style={styles.jobDate}>
                      {formatDate(exp.startDate)} —{" "}
                      {formatDate(exp.endDate, exp.isCurrent)}
                    </Text>
                    {exp.location && (
                      <Text style={styles.location}>{sanitizeText(exp.location)}</Text>
                    )}
                  </View>
                </View>
                {exp.description && (
                  <Text style={styles.description}>{sanitizeText(exp.description)}</Text>
                )}
                {exp.highlights.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.highlights.map((highlight, j) => (
                      <View key={j} style={styles.bulletItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{sanitizeText(highlight)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Projects</Text>
            {projects.map((project, i) => (
              <View key={i} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{sanitizeText(project.title)}</Text>
                <Text style={styles.projectRole}>
                  {project.role}
                  {project.client && ` | ${project.client}`}
                  {project.timeline && ` | ${project.timeline}`}
                </Text>
                {project.summary && (
                  <Text style={styles.projectSummary}>
                    {sanitizeText(project.summary)}
                  </Text>
                )}
                {project.techStack.length > 0 && (
                  <View style={styles.projectTech}>
                    {project.techStack.map((tech, j) => (
                      <Text key={j} style={styles.techBadge}>
                        {sanitizeText(tech)}
                      </Text>
                    ))}
                  </View>
                )}
                {project.outcomes.length > 0 && (
                  <View style={styles.projectOutcomes}>
                    {project.outcomes.map((outcome, j) => (
                      <View key={j} style={styles.outcomeItem}>
                        <Text style={styles.outcomeLabel}>{outcome.label}:</Text>
                        <Text style={styles.outcomeValue}>{outcome.value}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.educationItem}>
                <Text style={styles.degree}>
                  {sanitizeText(edu.degree)} in {sanitizeText(edu.field)}
                </Text>
                <Text style={styles.institution}>{sanitizeText(edu.institution)}</Text>
                <Text style={styles.eduMeta}>
                  {formatDate(edu.startDate)} — {formatDate(edu.endDate, edu.isCurrent)}
                  {edu.location && ` | ${sanitizeText(edu.location)}`}
                  {edu.gpa && ` | GPA: ${edu.gpa}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, i) => (
              <View key={i} style={styles.certItem}>
                <View style={{ flex: 1 }}>
                  {cert.credentialUrl ? (
                    <Link src={cert.credentialUrl} style={styles.link}>
                      <Text style={styles.certName}>{sanitizeText(cert.name)}</Text>
                    </Link>
                  ) : (
                    <Text style={styles.certName}>{sanitizeText(cert.name)}</Text>
                  )}
                  <Text style={styles.certIssuer}>{sanitizeText(cert.issuer)}</Text>
                </View>
                <Text style={styles.certDate}>{formatDate(cert.issueDate)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated from portfolio • {new Date().toLocaleDateString()}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
