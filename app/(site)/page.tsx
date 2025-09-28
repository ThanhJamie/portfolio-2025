import { Hero } from "@/components/sections/home/Hero";
import { Highlights } from "@/components/sections/home/Highlights";
import { SkillShowcase } from "@/components/sections/home/SkillShowcase";
import { getProfile, getSkillGroups, getSocialProof } from "@/lib/contentlayer/hooks";

export default function HomePage() {
  const profile = getProfile();
  const socialProof = getSocialProof();
  const skillGroups = getSkillGroups();

  return (
    <>
      <Hero profile={profile} testimonial={socialProof.testimonials[0]} />
      <Highlights metrics={socialProof.metrics} />
      <SkillShowcase skills={skillGroups} />
    </>
  );
}
