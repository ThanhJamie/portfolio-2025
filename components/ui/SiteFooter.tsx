import Link from "next/link";
import type { Route } from "next";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer
      aria-label="Site Footer"
      role="contentinfo"
      className="border-t border-border bg-muted/40"
    >
      <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Let&apos;s work together
          </h2>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            Ready to build remarkable digital experiences with Thanh Dang.
          </p>
          <p className="text-base text-muted-foreground">
            2025 © Thanh Dang. All rights reserved.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link href={"/contact" as Route} className={cn(buttonVariants({ size: "lg" }))}>
            Contact Me
          </Link>
          <a
            href="/resume.pdf"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            Download CV
          </a>
        </div>
      </Container>
    </footer>
  );
}
