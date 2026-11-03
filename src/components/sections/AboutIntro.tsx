import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import giselleVera from "@/assets/equipo/giselle-vera.webp";

/**
 * "Quiénes somos" de la portada: intro de la firma + retrato de la directora.
 * Lleva a /nosotros, que tiene el contenido completo. Dos columnas también en
 * celular, como el diseño aprobado.
 */
export function AboutIntro() {
  const keys = useMemo(() => ["about.intro" as const], []);
  const content = useSiteContent(keys);
  return (
    <section id="nosotros" className="bg-surface-alt py-12 md:py-24">
      <Container className="grid grid-cols-2 items-center gap-4 sm:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="grid min-w-0 content-center gap-4 sm:gap-6">
          <div className="grid gap-3">
            <h2 className="whitespace-nowrap font-display text-[20px] leading-[26px] font-bold tracking-h2 text-ink sm:text-[28px] sm:leading-[34px] md:text-h2 md:leading-h2">
              Quiénes somos
            </h2>
            <span className="h-[3px] w-12 bg-orange" aria-hidden="true" />
          </div>
          <p className="text-small text-ink-muted sm:text-base md:text-lead">
            {content["about.intro"]}
          </p>
          <div>
            <Button asChild variant="outline" size="sm" className="sm:h-11 sm:px-6">
              <Link to="/nosotros">
                Conoce más
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <figure className="relative m-0 w-full min-w-0 md:max-w-[440px] md:justify-self-end">
          <div className="overflow-hidden rounded-lg bg-surface [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%,0_5%)]">
            <img
              src={giselleVera}
              alt="Mgtr. Giselle Vera, directora general de VDM Consultores"
              width={720}
              height={1280}
              loading="lazy"
              className="aspect-[2/3] w-full sm:aspect-[3/4] object-cover object-top"
            />
          </div>
          <figcaption className="absolute inset-x-2 bottom-2 rounded-md border-l-[3px] border-orange bg-surface px-2 py-1.5 shadow-card sm:inset-x-6 sm:bottom-6 sm:px-4 sm:py-3">
            <span className="block whitespace-nowrap font-display text-[12.5px] leading-[18px] font-semibold text-ink sm:text-base">
              Mgtr. Giselle Vera
            </span>
            <span className="block text-[12px] leading-[16px] text-ink-muted sm:text-small">
              Directora General
            </span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
