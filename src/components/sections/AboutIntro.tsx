import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import giselleMesa from "@/assets/equipo/giselle-mesa.webp";

/**
 * Apertura de /nosotros: intro de la firma + retrato de la directora. "Conoce
 * más" baja al relato de la firma. Dos columnas también en celular, como el
 * diseño aprobado.
 */
export function AboutIntro() {
  return (
    <section className="bg-surface-alt py-10 md:py-14">
      <Container className="grid grid-cols-2 items-center gap-4 sm:gap-8 md:items-start lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="grid min-w-0 content-center gap-4 sm:gap-6 md:pt-10 lg:pt-16">
          <div className="grid gap-3">
            <h1 className="whitespace-nowrap font-display text-[20px] leading-[26px] font-bold tracking-h2 text-ink sm:text-[30px] sm:leading-[36px] md:text-[44px] md:leading-[50px] lg:text-[52px] lg:leading-[58px]">
              Quiénes somos
            </h1>
            <span className="h-[3px] w-12 bg-sky" aria-hidden="true" />
          </div>
          <p className="text-[13px] leading-[20px] text-ink-muted sm:text-base sm:leading-[26px] md:text-[19px] md:leading-[33px]">
            Somos una consultora paraguaya especializada en brindar asesoría
            jurídica, empresarial y de inversiones, con un enfoque
            multidisciplinario, integral, técnico y estratégico, orientado a
            la seguridad y al desarrollo sostenible de nuestros clientes.
          </p>
          <div>
            <Button asChild variant="outline" size="sm" className="sm:h-11 sm:px-6">
              <Link to="/nosotros#la-firma">
                Conoce más
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        <figure className="relative m-0 w-full min-w-0 md:max-w-[360px] md:justify-self-end">
          <div className="overflow-hidden rounded-lg bg-surface [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%,0_5%)]">
            <img
              src={giselleMesa}
              alt="Mgtr. Giselle Vera, directora general de VDM Consultores"
              width={760}
              height={1342}
              loading="lazy"
              className="aspect-[9/16] w-full object-cover object-top"
            />
          </div>
          <figcaption className="absolute inset-x-2 bottom-2 rounded-md border-l-[3px] border-sky bg-surface px-2 py-1.5 shadow-card sm:inset-x-6 sm:bottom-6 sm:px-4 sm:py-3">
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
