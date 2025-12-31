import { Hero } from "@/components/sections/home/Hero";
import { Highlights } from "@/components/sections/home/Highlights";
import { SkillShowcase } from "@/components/sections/home/SkillShowcase";
import { getProfile, getSkillGroups, getSocialProof } from "@/lib/content/hooks";

// Force dynamic rendering - database content
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, socialProof, skillGroups] = await Promise.all([
    getProfile(),
    getSocialProof(),
    getSkillGroups(),
  ]);

  return (
    <>
      <Hero profile={profile} testimonial={socialProof.testimonials[0]} />
      <Highlights metrics={socialProof.metrics} />
      <SkillShowcase skills={skillGroups} />
    </>
  );
}
