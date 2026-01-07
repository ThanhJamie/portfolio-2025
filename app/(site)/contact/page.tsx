import { ContactForm } from "@/components/sections/contact/ContactForm";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getProfile } from "@/lib/content/hooks";

// Force dynamic rendering - database content
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const profile = await getProfile();

  // Build contact methods from profile data
  const contactMethods = [
    {
      label: "Email",
      value: profile.primaryEmail,
      href: `mailto:${profile.primaryEmail}`,
    },
    {
      label: "Location",
      value: profile.location,
    },
    ...profile.socialLinks
      .filter((link) => link.label === "LinkedIn")
      .map((link) => ({
        label: "LinkedIn",
        value: link.href.replace("https://www.linkedin.com/in/", "linkedin.com/in/"),
        href: link.href,
      })),
  ];

  return (
    <div className="space-y-16">
      <section aria-labelledby="contact-heading" className="bg-background">
        <Container className="flex flex-col gap-12 py-16 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
              Contact
            </p>
            <SectionHeading id="contact-heading" className="text-4xl md:text-5xl">
              Let&apos;s build momentum together
            </SectionHeading>
            <p className="text-base text-muted-foreground">
              Share a bit about your product, team, and timeline. I pair with founders and
              growth-stage orgs to design inclusive experiences, ship high-quality
              frontends, and operationalize experimentation.
            </p>

            <dl className="grid gap-4 text-sm text-foreground md:grid-cols-2">
              {contactMethods.map((method) => (
                <div key={method.label}>
                  <dt className="font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    {method.label}
                  </dt>
                  <dd>
                    {method.href ? (
                      <a
                        href={method.href}
                        className="text-primary transition hover:underline"
                      >
                        {method.value}
                      </a>
                    ) : (
                      method.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="w-full max-w-xl rounded-3xl border border-border/60 bg-muted/30 p-6 shadow-soft">
            <ContactForm />
          </div>
        </Container>
      </section>
    </div>
  );
}
