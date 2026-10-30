import type { ReactNode } from "react";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
};

/**
 * Mini-hero compartido para los apartados internos (/nosotros, /servicios, …).
 * Fondo navy con el mismo lenguaje visual del Hero del Inicio:
 *   - Franja naranja diagonal grande.
 *   - Franja naranja secundaria más fina y traslúcida (sensación de capas).
 *   - Banda vertical blue-bright pegada al borde derecho.
 * Las tres piezas entran con un slide-in suave al cargar la página.
 */
export function PageHero({ eyebrow, title, lead }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy text-on-navy">
      {/* Banda vertical blue-bright (ancla visual al borde derecho). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-2.5 bg-blue-bright md:w-3"
      />
      {/* Franja naranja principal — diagonal grande. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-[-24px] hidden h-[calc(100%+48px)] w-20 origin-top -skew-x-[16deg] bg-orange md:block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-6 motion-safe:duration-700"
      />
      {/* Franja naranja secundaria — más fina, con transparencia. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-32 top-[-24px] hidden h-[calc(100%+48px)] w-5 origin-top -skew-x-[16deg] bg-orange/55 md:block motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-6 motion-safe:duration-700 motion-safe:delay-150"
      />
      <Container className="relative grid gap-5 py-14 md:py-20">
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-10 bg-orange" aria-hidden="true" />
          <Eyebrow tone="onNavy">{eyebrow}</Eyebrow>
        </div>
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
