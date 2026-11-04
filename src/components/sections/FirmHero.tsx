import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Button } from "@/components/ui/button";
import { useSiteContent } from "@/hooks/useSiteContent";
import giselleLaptop from "@/assets/equipo/giselle-laptop.webp";

/**
 * Cabecera de /nosotros: texto a la izquierda y foto a la derecha, cortada en
 * diagonal (la V del logo) con la franja navy del lema. Dos columnas también
 * en celular, como el diseño aprobado.
 */
export function FirmHero() {
  const keys = useMemo(() => ["hero.lead" as const], []);
  const content = useSiteContent(keys);
  return (
    <section
      className="relative overflow-hidden border-b border-line bg-surface"
    >
      {/* Foto + franja: ocupan la mitad derecha hasta el borde de la pantalla. */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-[50%] md:w-[40%] motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500"
      >
        <img
          src={giselleLaptop}
          alt=""
          width={1024}
          height={1536}
          className="absolute inset-x-0 top-0 h-full w-full object-cover object-[50%_35%] md:h-[80%] md:object-[50%_40%] [clip-path:polygon(26%_0,100%_0,100%_100%,4%_100%)]"
        />
        <div className="absolute inset-x-0 bottom-0 grid min-h-[30%] content-center bg-navy md:min-h-[20%] py-4 pl-[18%] pr-3 [clip-path:polygon(12%_0,100%_0,100%_100%,4%_100%)] sm:pl-[16%] sm:pr-8">
          <span className="absolute left-[22%] top-0 h-[3px] w-[18%] bg-sky" />
          <p className="font-display text-[13px] leading-[17px] font-medium italic text-on-navy sm:text-[20px] sm:leading-[26px] lg:text-[26px] lg:leading-[34px]">
            Un solo equipo,
            <br />
            soluciones integrales.
          </p>
        </div>
      </div>

      <Container className="relative py-10 sm:py-16 md:py-24 lg:py-28">
        <div className="grid w-[50%] min-w-0 grid-cols-[minmax(0,1fr)] gap-4 pr-3 sm:gap-6 sm:pr-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="h-[2px] w-4 shrink-0 bg-blue sm:h-[3px] sm:w-10" aria-hidden="true" />
            <Eyebrow className="whitespace-nowrap text-[8.5px] tracking-[0.06em] sm:text-eyebrow sm:tracking-eyebrow">
              VDM Consultores · Paraguay
            </Eyebrow>
          </div>
          <h2 className="font-display text-[24px] leading-[26px] font-bold tracking-tight text-ink sm:text-[40px] sm:leading-[44px] md:text-[52px] md:leading-[56px] lg:text-[60px] lg:leading-[62px]">
            Fortaleciendo empresas,{" "}
            <em className="block not-italic text-blue">
              potenciando inversiones.
            </em>
          </h2>
          <p className="text-[12px] leading-[18px] text-ink-muted sm:text-base sm:leading-[26px] lg:text-lead">
            {content["hero.lead"]}
          </p>
          <div className="grid justify-items-start gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
            <Button asChild size="sm" className="h-8 px-3 text-[11.5px] sm:h-11 sm:px-6 sm:text-label">
              <Link to="/contacto">
                Agenda tu consulta
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="h-8 px-3 text-[11.5px] sm:h-11 sm:px-6 sm:text-label">
              <Link to="/servicios">Conoce nuestros servicios</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
