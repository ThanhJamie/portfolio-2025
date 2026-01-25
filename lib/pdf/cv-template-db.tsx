import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { sanitizeText } from "./utils";
import type { CVData } from "@/types/cv";

// Re-export for convenience
export type { CVData };

// Modern Developer CV - Dark accent with clean design
const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
  },
  // Two-column layout
  container: {
    flexDirection: "row",
    height: "100%",
  },
  // Left sidebar - dark theme with better visibility
  sidebar: {
    width: "32%",
    backgroundColor: "#1e293b",
    padding: 20,
    color: "#f8fafc",
  },
  // Main content area
  mainContent: {
    width: "68%",
    padding: 25,
    paddingLeft: 20,
  },
  // Sidebar styles - enhanced visibility
  sidebarName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 4,
    lineHeight: 1.2,
  },
  sidebarHeadline: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#60a5fa",
    marginBottom: 16,
    lineHeight: 1.3,
  },
  sidebarSection: {
    marginBottom: 16,
  },
  sidebarSectionTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#60a5fa",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1.5 solid #3b82f6",
    paddingBottom: 4,
  },
  sidebarText: {
    fontSize: 8.5,
    color: "#f1f5f9",
    lineHeight: 1.5,
    marginBottom: 3,
  },
  sidebarLink: {
    fontSize: 8.5,
    color: "#93c5fd",
    textDecoration: "none",
    marginBottom: 4,
  },
  sidebarLabel: {
    fontSize: 7,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  // Skill tags in sidebar
  sidebarSkillGroup: {
    marginBottom: 10,
  },
  sidebarSkillCategory: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  sidebarSkillTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  sidebarSkillTag: {
    fontSize: 7,
    color: "#e2e8f0",
    backgroundColor: "#334155",
    padding: "3 6",
    borderRadius: 3,
    border: "0.5 solid #475569",
  },
  sidebarSkillTagAI: {
    fontSize: 7,
    color: "#c4b5fd",
    backgroundColor: "#4c1d95",
    padding: "3 6",
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
    border: "0.5 solid #7c3aed",
  },
  // Main content styles
  mainSection: {
    marginBottom: 14,
  },
  mainSectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: "2 solid #3b82f6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Experience
  experienceItem: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  company: {
    fontSize: 9,
    color: "#3b82f6",
    fontFamily: "Helvetica-Bold",
  },
  jobMeta: {
    alignItems: "flex-end",
  },
  jobDate: {
    fontSize: 8,
    color: "#64748b",
    fontFamily: "Helvetica-Bold",
  },
  location: {
    fontSize: 7,
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
    marginBottom: 3,
  },
  bullet: {
    width: 10,
    fontSize: 8,
    color: "#3b82f6",
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.4,
    color: "#334155",
  },
  // Projects
  projectItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
    borderLeft: "3 solid #3b82f6",
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  projectTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  projectRole: {
    fontSize: 7,
    color: "#64748b",
  },
  projectSummary: {
    fontSize: 8,
    lineHeight: 1.4,
    color: "#475569",
    marginTop: 3,
  },
  projectTech: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginTop: 5,
  },
  techBadge: {
    fontSize: 6.5,
    color: "#6366f1",
    backgroundColor: "#eef2ff",
    padding: "2 5",
    borderRadius: 2,
    fontFamily: "Helvetica-Bold",
  },
  projectOutcomes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 5,
  },
  outcomeItem: {
    flexDirection: "row",
    gap: 3,
  },
  outcomeValue: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },
  outcomeLabel: {
    fontSize: 7,
    color: "#64748b",
  },
  // Education
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
  },
  institution: {
    fontSize: 8,
    color: "#3b82f6",
  },
  eduMeta: {
    fontSize: 7,
    color: "#64748b",
    marginTop: 2,
  },
  // Certifications
  certItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    paddingBottom: 4,
    borderBottom: "0.5 solid #e2e8f0",
  },
  certName: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    flex: 1,
  },
  certIssuer: {
    fontSize: 7,
    color: "#64748b",
  },
  certDate: {
    fontSize: 7,
    color: "#94a3b8",
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 15,
    left: 0,
    right: 0,
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 6,
    color: "#94a3b8",
  },
  pageNumber: {
    fontSize: 6,
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

// Get sidebar skill tag style
function getSidebarSkillStyle(category: string) {
  const cat = category.toLowerCase();
  if (cat.includes("ai") || cat.includes("ml") || cat.includes("machine")) {
    return styles.sidebarSkillTagAI;
  }
  return styles.sidebarSkillTag;
}

export function CVTemplateFromDB({ data }: { data: CVData }) {
  const { profile, experiences, education, skills, projects, certifications } = data;

  // Sort skills to put AI/ML first
  const sortedSkills = [...skills].sort((a, b) => {
    const aIsAI =
      a.category.toLowerCase().includes("ai") || a.category.toLowerCase().includes("ml");
    const bIsAI =
      b.category.toLowerCase().includes("ai") || b.category.toLowerCase().includes("ml");
    if (aIsAI && !bIsAI) return -1;
    if (!aIsAI && bIsAI) return 1;
    return 0;
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            {/* Name & Title */}
            <Text style={styles.sidebarName}>{sanitizeText(profile.name)}</Text>
            <Text style={styles.sidebarHeadline}>{sanitizeText(profile.headline)}</Text>

            {/* Contact */}
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarSectionTitle}>Contact</Text>
              <Text style={styles.sidebarLabel}>Email</Text>
              <Link src="mailto:chithanhso10@gmail.com" style={styles.sidebarLink}>
                chithanhso10@gmail.com
              </Link>
              <Link src="mailto:thanhjamieai@gmail.com" style={styles.sidebarLink}>
                thanhjamieai@gmail.com
              </Link>
              <Text style={styles.sidebarLabel}>Location</Text>
              <Text style={styles.sidebarText}>{sanitizeText(profile.location)}</Text>
              <Text style={styles.sidebarLabel}>LinkedIn</Text>
              <Link
                src="https://www.linkedin.com/in/thanhjamieai/"
                style={styles.sidebarLink}
              >
                thanhjamieai
              </Link>
              {profile.githubUrl && (
                <>
                  <Text style={styles.sidebarLabel}>GitHub</Text>
                  <Link src={profile.githubUrl} style={styles.sidebarLink}>
                    {profile.githubUrl.replace("https://github.com/", "")}
                  </Link>
                </>
              )}
            </View>

            {/* Skills */}
            {sortedSkills.length > 0 && (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarSectionTitle}>Skills</Text>
                {sortedSkills.slice(0, 5).map((group, i) => (
                  <View key={i} style={styles.sidebarSkillGroup}>
                    <Text style={styles.sidebarSkillCategory}>{group.category}</Text>
                    <View style={styles.sidebarSkillTags}>
                      {group.items.slice(0, 6).map((skill, j) => (
                        <Text key={j} style={getSidebarSkillStyle(group.category)}>
                          {sanitizeText(skill)}
                        </Text>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarSectionTitle}>Certifications</Text>
                {certifications.slice(0, 4).map((cert, i) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    {cert.credentialUrl ? (
                      <Link src={cert.credentialUrl} style={styles.sidebarLink}>
                        {sanitizeText(cert.name)}
                      </Link>
                    ) : (
                      <Text style={styles.sidebarText}>{sanitizeText(cert.name)}</Text>
                    )}
                    <Text style={{ fontSize: 6, color: "#64748b" }}>
                      {cert.issuer} - {formatDate(cert.issueDate)}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Education */}
            {education.length > 0 && (
              <View style={styles.sidebarSection}>
                <Text style={styles.sidebarSectionTitle}>Education</Text>
                {education.map((edu, i) => (
                  <View key={i} style={{ marginBottom: 6 }}>
                    <Text style={styles.sidebarText}>
                      {sanitizeText(edu.degree)}
                      {edu.field ? ` in ${sanitizeText(edu.field)}` : ""}
                    </Text>
                    <Text style={{ fontSize: 7, color: "#64748b" }}>
                      {sanitizeText(edu.institution)}
                    </Text>
                    <Text style={{ fontSize: 6, color: "#64748b" }}>
                      {formatDate(edu.endDate, edu.isCurrent)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Summary */}
            {profile.summary && (
              <View style={styles.mainSection}>
                <Text style={styles.mainSectionTitle}>Professional Summary</Text>
                <Text style={{ fontSize: 8.5, lineHeight: 1.5, color: "#334155" }}>
                  {sanitizeText(profile.summary)}
                </Text>
              </View>
            )}

            {/* Experience */}
            {experiences.length > 0 && (
              <View style={styles.mainSection}>
                <Text style={styles.mainSectionTitle}>Professional Experience</Text>
                {experiences.map((exp, i) => (
                  <View key={i} style={styles.experienceItem}>
                    <View style={styles.jobHeader}>
                      <View>
                        <Text style={styles.jobTitle}>{sanitizeText(exp.position)}</Text>
                        <Text style={styles.company}>{sanitizeText(exp.company)}</Text>
                      </View>
                      <View style={styles.jobMeta}>
                        <Text style={styles.jobDate}>
                          {formatDate(exp.startDate)} -{" "}
                          {formatDate(exp.endDate, exp.isCurrent)}
                        </Text>
                        {exp.location && (
                          <Text style={styles.location}>
                            {sanitizeText(exp.location)}
                          </Text>
                        )}
                      </View>
                    </View>
                    {exp.description && (
                      <Text style={styles.description}>
                        {sanitizeText(exp.description)}
                      </Text>
                    )}
                    {exp.highlights.length > 0 && (
                      <View style={styles.bulletList}>
                        {exp.highlights.map((highlight, j) => (
                          <View key={j} style={styles.bulletItem}>
                            <Text style={styles.bullet}>▸</Text>
                            <Text style={styles.bulletText}>
                              {sanitizeText(highlight)}
                            </Text>
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
              <View style={styles.mainSection}>
                <Text style={styles.mainSectionTitle}>Featured Projects</Text>
                {projects.slice(0, 3).map((project, i) => (
                  <View key={i} style={styles.projectItem}>
                    <View style={styles.projectHeader}>
                      <Text style={styles.projectTitle}>
                        {sanitizeText(project.title)}
                      </Text>
                      <Text style={styles.projectRole}>
                        {project.role}
                        {project.timeline && ` | ${project.timeline}`}
                      </Text>
                    </View>
                    {project.summary && (
                      <Text style={styles.projectSummary}>
                        {sanitizeText(project.summary)}
                      </Text>
                    )}
                    {project.techStack.length > 0 && (
                      <View style={styles.projectTech}>
                        {project.techStack.slice(0, 8).map((tech, j) => (
                          <Text key={j} style={styles.techBadge}>
                            {sanitizeText(tech)}
                          </Text>
                        ))}
                      </View>
                    )}
                    {project.outcomes.length > 0 && (
                      <View style={styles.projectOutcomes}>
                        {project.outcomes.slice(0, 3).map((outcome, j) => (
                          <View key={j} style={styles.outcomeItem}>
                            <Text style={styles.outcomeValue}>
                              {sanitizeText(outcome.value)}
                            </Text>
                            <Text style={styles.outcomeLabel}>
                              {sanitizeText(outcome.label)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            chithanhso10@gmail.com | Generated {new Date().toLocaleDateString()}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
