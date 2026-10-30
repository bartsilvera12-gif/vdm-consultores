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
 * Fondo navy corporativo con un motivo de líneas radiantes azules (inspirado en
 * PKF): un abanico de rayos finos que nace del borde derecho y una banda vertical
 * blue-bright como ancla. Entra con un slide-in suave al cargar la página.
 */
export function PageHero({ eyebrow, title, lead }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-navy text-on-navy">
      {/* Abanico de rayos y arcos azules — nace del borde derecho (sello PKF). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[70%] md:block motion-safe:animate-in motion-safe:fade-in motion-safe:duration-700"
      >
        <svg
          viewBox="0 0 600 400"
          preserveAspectRatio="xMaxYMid slice"
          className="h-full w-full"
        >
          {/* Rayos finos que abren desde el borde derecho hacia la izquierda. */}
          <g
            stroke="var(--vdm-blue-bright)"
            fill="none"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"
          >
            {Array.from({ length: 15 }).map((_, i) => {
              const angle = (128 + i * 7.4) * (Math.PI / 180);
              const x2 = 600 + Math.cos(angle) * 900;
              const y2 = 200 + Math.sin(angle) * 900;
              return (
                <line
                  key={i}
                  x1="600"
                  y1="200"
                  x2={x2}
                  y2={y2}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>
          {/* Arcos concéntricos tenues centrados en el borde derecho. */}
          <g
            stroke="var(--vdm-blue-bright)"
            fill="none"
            opacity="0.28"
            vectorEffect="non-scaling-stroke"
          >
            {[140, 240, 340].map((r) => (
              <circle
                key={r}
                cx="600"
                cy="200"
                r={r}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
        </svg>
      </div>
      {/* Banda vertical blue-bright (ancla visual al borde derecho). */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-2.5 bg-blue-bright md:w-3"
      />
      <Container className="relative grid gap-5 py-14 md:py-20">
        <div className="flex items-center gap-3">
          <span className="h-[3px] w-10 bg-blue-bright" aria-hidden="true" />
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
