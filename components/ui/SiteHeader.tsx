"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { NavBar } from "@/components/ui/NavBar";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header
      aria-label="Site Header"
      role="banner"
      className="border-b border-border bg-background"
    >
      <Container className="flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Thanh Dang
          </Link>
          <div className="md:hidden">
            <Button
              variant="ghost"
              type="button"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-controls="primary-navigation"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              {isMenuOpen ? "Close" : "Menu"}
            </Button>
          </div>
        </div>

        <NavBar
          className={cn(
            "items-start gap-4 md:flex md:flex-row md:flex-wrap md:items-center md:gap-6",
            isMenuOpen ? "flex flex-col" : "hidden md:flex",
          )}
          onNavigate={() => setIsMenuOpen(false)}
        />
      </Container>
    </header>
  );
}
