import { Education } from "@/components/sections/about/Education";
import { Experience } from "@/components/sections/about/Experience";
import { Story } from "@/components/sections/about/Story";
import { TechStack } from "@/components/sections/about/TechStack";
import {
  getCertificationItems,
  getEducationItems,
  getExperienceItems,
  getProfile,
  getTechStack,
} from "@/lib/contentlayer/hooks";

export default function AboutPage() {
  const profile = getProfile();
  const experienceItems = getExperienceItems();
  const educationItems = getEducationItems();
  const certificationItems = getCertificationItems();
  const techStack = getTechStack();

  return (
    <div className="-mx-6 space-y-16 md:-mx-8">
      <Story profile={profile} />
      <TechStack tech={techStack} />
      <Experience experience={experienceItems} />
      <Education education={educationItems} certifications={certificationItems} />
    </div>
  );
}
