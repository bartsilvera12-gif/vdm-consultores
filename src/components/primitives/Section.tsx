import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "surface" | "surface-alt" | "navy";
  bare?: boolean;
};

const toneClass = {
  surface: "bg-surface text-ink",
  "surface-alt": "bg-surface-alt text-ink",
  navy: "bg-navy text-on-navy",
};

export function Section({
  id,
  children,
  className,
  tone = "surface",
  bare = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        toneClass[tone],
        !bare && "py-16 md:py-24",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  onNavy = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  onNavy?: boolean;
}) {
  return (
    <div className="mb-12 grid max-w-[720px] gap-4">
      {eyebrow && (
        <p
          className={cn(
            "font-display text-eyebrow font-semibold uppercase tracking-eyebrow",
            onNavy ? "text-orange" : "text-orange-text",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-display font-semibold tracking-h2",
          "text-[28px] leading-[34px] md:text-h2 md:leading-h2",
          onNavy ? "text-on-navy" : "text-ink",
        )}
      >
        {title}
      </h2>
      {lead && (
        <p
          className={cn(
            "text-lead",
            onNavy ? "text-on-navy-muted" : "text-ink-muted",
          )}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
