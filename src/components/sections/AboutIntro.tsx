import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import giselleMesa from "@/assets/equipo/giselle-mesa.webp";

/**
 * Apertura de /nosotros: intro de la firma y el retrato de la directora con su
 * nombre como pie de foto, como en el boceto de la clienta. Sobrio: sin
 * sombras ni elementos flotando. Dos columnas también en celular.
 */
export function AboutIntro() {
  return (
    <section className="bg-surface-alt py-10 md:py-16 lg:py-20">
      <Container className="grid grid-cols-2 items-center gap-5 sm:gap-10 md:items-start lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div className="grid min-w-0 content-center gap-4 sm:gap-7 md:pt-4 lg:pt-8">
          <div className="grid gap-3 sm:gap-5">
            <h1 className="whitespace-nowrap font-display text-[20px] leading-[26px] font-bold tracking-h2 text-ink sm:text-[30px] sm:leading-[36px] md:text-[44px] md:leading-[50px] lg:text-[56px] lg:leading-[60px]">
              Quiénes somos
            </h1>
            <span className="h-[3px] w-12 bg-sky" aria-hidden="true" />
          </div>
          <p className="max-w-[34rem] text-[13px] leading-[20px] text-ink-muted sm:border-l-2 sm:border-sky sm:pl-5 sm:text-base sm:leading-[26px] md:pl-6 md:text-[19px] md:leading-[33px]">
            Somos una consultora paraguaya especializada en brindar asesoría
            jurídica, empresarial y de inversiones, con un enfoque
            multidisciplinario, integral, técnico y estratégico, orientado a
            la seguridad y al desarrollo sostenible de nuestros clientes.
          </p>
          <div>
            <Button asChild variant="outline" size="sm" className="group border-ink/30 text-ink hover:border-ink sm:h-11 sm:px-6">
              <Link to="/nosotros#la-firma">
                Conoce más
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </div>

        <figure className="m-0 w-full min-w-0 md:max-w-[330px] md:justify-self-end">
          <img
            src={giselleMesa}
            alt="Mgtr. Giselle Vera, directora general de VDM Consultores"
            width={760}
            height={1342}
            loading="lazy"
            className="aspect-[9/16] w-full rounded-sm object-cover object-top"
          />
          <figcaption className="mt-3 border-t border-line pt-3 sm:mt-4 sm:pt-4">
            <span className="block font-display text-[12.5px] leading-[18px] font-semibold text-ink sm:text-base">
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
