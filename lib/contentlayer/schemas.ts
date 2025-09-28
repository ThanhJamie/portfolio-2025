import { z } from "zod";

const nonEmptyString = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const hrefSchema = z
  .string()
  .trim()
  .min(1, "Link is required")
  .refine((value) => {
    if (value.startsWith("mailto:")) {
      return value.length > "mailto:".length;
    }
    if (value.startsWith("tel:")) {
      return value.length > "tel:".length;
    }

    try {
      // eslint-disable-next-line no-new -- only used for validation
      new URL(value);
      return true;
    } catch {
      return value.startsWith("/");
    }
  }, "Link must be a valid URL, mailto:, tel:, or absolute path");

const isoDateSchema = z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
  message: "Date must be in YYYY-MM-DD format",
});

const imageSchema = z
  .object({
    src: nonEmptyString("Image source"),
    alt: nonEmptyString("Image alt text"),
  })
  .passthrough();

export const heroStatSchema = z
  .object({
    label: nonEmptyString("Statistic label"),
    value: nonEmptyString("Statistic value"),
    description: nonEmptyString("Statistic description"),
  })
  .passthrough();

const socialLinkSchema = z
  .object({
    label: nonEmptyString("Social link label"),
    href: hrefSchema,
  })
  .passthrough();

export const profileSchema = z
  .object({
    name: nonEmptyString("Name"),
    headline: nonEmptyString("Headline"),
    tagline: nonEmptyString("Tagline"),
    location: nonEmptyString("Location"),
    primaryEmail: z.string().email("Primary email must be valid"),
    availability: nonEmptyString("Availability"),
    heroImage: imageSchema,
    heroStats: z.array(heroStatSchema).min(1, "Provide at least one hero statistic"),
    callToAction: z
      .object({
        label: nonEmptyString("Call-to-action label"),
        href: hrefSchema,
      })
      .passthrough(),
    socialLinks: z.array(socialLinkSchema).min(1, "Provide at least one social link"),
    story: z.array(nonEmptyString("Story paragraph")).default([]),
    focusAreas: z.array(nonEmptyString("Focus area")).default([]),
    recentWins: z.array(nonEmptyString("Recent win")).default([]),
  })
  .passthrough();

export const skillGroupSchema = z
  .object({
    id: nonEmptyString("Skill group id"),
    title: nonEmptyString("Skill group title"),
    summary: nonEmptyString("Skill group summary"),
    items: z
      .array(nonEmptyString("Skill highlight"))
      .min(1, "Include at least one highlight"),
  })
  .passthrough();

const techItemSchema = z
  .object({
    name: nonEmptyString("Technology name"),
    summary: nonEmptyString("Technology summary"),
  })
  .passthrough();

export const techStackSchema = z.object({
  frontend: z.array(techItemSchema).min(1, "Include at least one frontend capability"),
  backend: z.array(techItemSchema).min(1, "Include at least one backend capability"),
  ai_and_ml: z.array(techItemSchema).min(1, "Include at least one AI or ML capability"),
  tools_and_devops: z
    .array(techItemSchema)
    .min(1, "Include at least one tooling or DevOps capability"),
  concepts_and_principles: z
    .array(techItemSchema)
    .min(1, "Include at least one concept or principle"),
});

const endDateSchema = z.union([
  isoDateSchema,
  z.literal("present"),
  z.literal("Present"),
]);

export const experienceItemSchema = z
  .object({
    id: nonEmptyString("Experience id"),
    company: nonEmptyString("Company name"),
    role: nonEmptyString("Role"),
    location: nonEmptyString("Location"),
    startDate: isoDateSchema,
    endDate: endDateSchema,
    summary: nonEmptyString("Experience summary"),
    highlights: z
      .array(nonEmptyString("Experience highlight"))
      .min(1, "Include at least one highlight"),
  })
  .passthrough();

export const educationItemSchema = z
  .object({
    institution: nonEmptyString("Institution"),
    credential: nonEmptyString("Credential"),
    yearCompleted: z
      .string()
      .trim()
      .refine((value) => /^\d{4}$/.test(value), {
        message: "Year completed must be a four digit year",
      }),
    location: nonEmptyString("Location"),
  })
  .passthrough();

export const certificationItemSchema = z
  .object({
    title: nonEmptyString("Certification title"),
    time: nonEmptyString("Certification time"),
    link: hrefSchema,
    tech: z
      .array(nonEmptyString("Certification tech"))
      .min(1, "Include at least one tech tag")
      .optional(),
  })
  .passthrough();

const testimonialSchema = z
  .object({
    quote: nonEmptyString("Testimonial quote"),
    person: z
      .object({
        name: nonEmptyString("Person name"),
        title: nonEmptyString("Person title"),
        company: nonEmptyString("Person company"),
        avatar: nonEmptyString("Avatar path").optional(),
      })
      .passthrough(),
  })
  .passthrough();

const logoSchema = z
  .object({
    name: nonEmptyString("Logo name"),
    src: nonEmptyString("Logo source"),
    alt: nonEmptyString("Logo alt text"),
  })
  .passthrough();

const metricSchema = z
  .object({
    label: nonEmptyString("Metric label"),
    value: nonEmptyString("Metric value"),
    description: nonEmptyString("Metric description"),
  })
  .passthrough();

export const socialProofSchema = z
  .object({
    testimonials: z.array(testimonialSchema).min(1, "Provide at least one testimonial"),
    logos: z.array(logoSchema).min(1, "Provide at least one logo"),
    metrics: z.array(metricSchema).min(1, "Provide at least one metric"),
  })
  .passthrough();

export const toggleSettingsSchema = z
  .object({
    servicesEnabled: z.boolean(),
    blogEnabled: z.boolean(),
    testimonialsEnabled: z.boolean(),
  })
  .passthrough();

export const projectOutcomeSchema = z
  .object({
    label: nonEmptyString("Outcome label"),
    value: nonEmptyString("Outcome value"),
  })
  .passthrough();

const galleryImageSchema = z
  .object({
    type: z.literal("image"),
    src: nonEmptyString("Gallery image source"),
    alt: nonEmptyString("Gallery image alt text"),
    caption: z.string().optional(),
  })
  .passthrough();

const galleryVideoSchema = z
  .object({
    type: z.literal("video"),
    src: nonEmptyString("Gallery media source"),
    alt: nonEmptyString("Gallery media alt text"),
    caption: z.string().optional(),
  })
  .passthrough();

export const projectGalleryItemSchema = z.union([galleryImageSchema, galleryVideoSchema]);

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectCaseStudySchema = z
  .object({
    title: nonEmptyString("Project title"),
    slug: z.string().trim().regex(slugPattern, "Slug must be lowercase kebab-case"),
    client: nonEmptyString("Client name"),
    discipline: nonEmptyString("Discipline"),
    focus: nonEmptyString("Focus"),
    timeline: nonEmptyString("Timeline"),
    summary: nonEmptyString("Summary"),
    problem: nonEmptyString("Problem statement"),
    approach: z
      .array(nonEmptyString("Approach step"))
      .min(1, "Provide at least one approach step"),
    role: nonEmptyString("Role"),
    stack: z
      .array(nonEmptyString("Stack item"))
      .min(1, "Provide at least one stack item"),
    outcomes: z
      .array(projectOutcomeSchema)
      .min(1, "Provide at least one measurable outcome"),
    tags: z.array(nonEmptyString("Tag")),
    thumbnail: nonEmptyString("Thumbnail path"),
    heroImage: imageSchema,
    gallery: z.array(projectGalleryItemSchema).default([]),
    publishedAt: isoDateSchema,
    featured: z.boolean().default(false),
    caseStudyUrl: hrefSchema.optional(),
    liveUrl: hrefSchema.optional(),
  })
  .passthrough();

export type HeroStat = z.infer<typeof heroStatSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type TechStack = z.infer<typeof techStackSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type CertificationItem = z.infer<typeof certificationItemSchema>;
export type SocialProof = z.infer<typeof socialProofSchema>;
export type ToggleSettings = z.infer<typeof toggleSettingsSchema>;
export type ProjectOutcome = z.infer<typeof projectOutcomeSchema>;
export type ProjectGalleryItem = z.infer<typeof projectGalleryItemSchema>;
export type ProjectCaseStudy = z.infer<typeof projectCaseStudySchema>;

export const profileCollectionSchema = z.array(profileSchema).min(1);
export const skillGroupCollectionSchema = z.array(skillGroupSchema);
export const techStackCollectionSchema = z.array(techStackSchema);
export const experienceCollectionSchema = z.array(experienceItemSchema);
export const educationCollectionSchema = z.array(educationItemSchema);
export const certificationCollectionSchema = z.array(certificationItemSchema);
export const socialProofCollectionSchema = z.array(socialProofSchema);
export const toggleSettingsCollectionSchema = z.array(toggleSettingsSchema).max(1);
export const projectCollectionSchema = z.array(projectCaseStudySchema);
