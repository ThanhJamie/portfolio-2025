"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { HTMLAttributes } from "react";
import type { Route } from "next";

import { cn } from "@/lib/utils";

const NAV_ITEMS: Array<{ href: Route; label: string }> = [
  { href: "/" as Route, label: "Home" },
  { href: "/about" as Route, label: "About" },
  { href: "/projects" as Route, label: "Projects" },
  { href: "/contact" as Route, label: "Contact" },
];

export interface NavBarProps extends HTMLAttributes<HTMLElement> {
  onNavigate?: () => void;
}

export function NavBar({ className, onNavigate, ...props }: NavBarProps) {
  const pathname = usePathname();

  return (
    <nav
      id="primary-navigation"
      aria-label="Primary Navigation"
      className={cn("flex items-center gap-6 text-sm font-medium", className)}
      {...props}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-muted-foreground",
            )}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
