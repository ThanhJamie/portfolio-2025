import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export function SectionHeading({ className, children, ...props }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        "text-3xl font-semibold tracking-tight text-foreground md:text-4xl",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}
