import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  animation?: "pulse" | "bounce" | "spin" | "ping" | "none";
  animationDuration?: string;
  animationDelay?: string;
}

export function AnimatedIcon({
  icon: Icon,
  className,
  animation = "pulse",
  animationDuration = "2s",
  animationDelay = "0s",
}: AnimatedIconProps) {
  const animationClass = {
    pulse: "animate-pulse",
    bounce: "animate-bounce",
    spin: "animate-spin",
    ping: "animate-ping",
    none: "",
  }[animation];

  return (
    <Icon
      className={cn(animationClass, className)}
      style={{
        animationDuration,
        animationDelay,
      }}
    />
  );
}

interface IconGroupProps {
  icons: LucideIcon[];
  className?: string;
  itemClassName?: string;
  animation?: AnimatedIconProps["animation"];
  staggerDelay?: number;
}

export function IconGroup({
  icons,
  className,
  itemClassName = "size-4",
  animation = "pulse",
  staggerDelay = 0.1,
}: IconGroupProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {icons.map((Icon, i) => (
        <AnimatedIcon
          key={i}
          icon={Icon}
          className={itemClassName}
          animation={animation}
          animationDelay={`${i * staggerDelay}s`}
        />
      ))}
    </div>
  );
}
