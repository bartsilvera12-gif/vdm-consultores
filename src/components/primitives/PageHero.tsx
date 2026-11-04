import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

type PageHeroProps = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
};

/**
 * Mini-hero compartido para los apartados internos (/nosotros, /servicios, …).
 * Fondo navy corporativo liso, con la línea opcional de contexto (eyebrow)
 * sobre el título.
 */
export function PageHero({ eyebrow, title, lead }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy text-on-navy">
      <Container className="relative grid gap-5 py-14 md:py-20">
        {eyebrow && (
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-10 bg-blue-bright" aria-hidden="true" />
            <Eyebrow tone="onNavy">{eyebrow}</Eyebrow>
          </div>
        )}
        <h1 className="max-w-3xl font-display text-[32px] leading-[38px] font-bold tracking-tight text-on-navy sm:text-[40px] sm:leading-[44px] md:text-[48px] md:leading-[52px]">
          {title}
        </h1>
        {lead && (
          <p className="max-w-2xl text-body text-on-navy-muted md:text-lead">
            {lead}
          </p>
        )}
      </Container>
    </section>
  );
}
