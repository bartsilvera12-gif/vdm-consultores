import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import equipoReunido from "@/assets/equipo-reunido.webp";

/**
 * "Fortaleciendo empresas" en /nosotros: texto a la izquierda y la foto del
 * equipo reunido a la derecha, completa, con la franja navy del lema debajo
 * (boceto de la clienta). En celular la foto va debajo del texto.
 */
export function FirmHero() {
  const keys = useMemo(() => ["hero.lead" as const], []);
  const content = useSiteContent(keys);
  return (
    <section className="border-b border-line bg-surface">
      <Container className="grid items-center gap-10 pt-6 pb-12 md:grid-cols-2 md:gap-12 md:pt-6 md:pb-20 lg:gap-16 lg:pt-8 lg:pb-24">
        <Reveal className="grid min-w-0 gap-5 sm:gap-6">
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-10 shrink-0 bg-blue" aria-hidden="true" />
            <Eyebrow>VDM Consultores · Paraguay</Eyebrow>
          </div>
          <h2 className="font-display text-[32px] leading-[36px] font-bold tracking-tight text-ink sm:text-[40px] sm:leading-[44px] lg:text-[52px] lg:leading-[56px]">
            Fortaleciendo empresas,{" "}
            <em className="block not-italic text-blue">
              potenciando inversiones
            </em>
          </h2>
          <p className="text-base leading-[26px] text-ink-muted lg:text-lead">
            {content["hero.lead"]}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/contacto">
                Agenda tu consulta
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/servicios">Conoce nuestros servicios</Link>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={120} className="min-w-0">
          <figure className="m-0 overflow-hidden rounded-xl shadow-card">
            <img
              src={equipoReunido}
              alt="Equipo de VDM Consultores reunido en la oficina"
              width={1600}
              height={895}
              loading="lazy"
              className="aspect-[1600/895] w-full object-cover"
            />
            <figcaption className="relative bg-navy px-6 py-5 sm:px-8 sm:py-6">
              <span className="absolute left-6 top-0 h-[3px] w-16 bg-sky sm:left-8" aria-hidden="true" />
              <p className="font-display text-[20px] leading-[26px] font-medium italic text-on-navy sm:text-[24px] sm:leading-[32px]">
                Un solo equipo, soluciones integrales
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </Container>
    </section>
  );
}
