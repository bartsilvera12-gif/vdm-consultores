import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EyebrowProps = {
  children: ReactNode;
  tone?: "default" | "onNavy" | "muted";
  className?: string;
};

const toneClass = {
  default: "text-orange-text",
  onNavy: "text-orange",
  muted: "text-ink-muted",
};

export function Eyebrow({
  children,
  tone = "default",
  className,
}: EyebrowProps) {
  return (
    <p
      className={cn(
        "font-display text-eyebrow font-semibold uppercase tracking-eyebrow",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </p>
  );
}
