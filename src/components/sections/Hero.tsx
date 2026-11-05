import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import { useSiteContent, type SiteContentKey } from "@/hooks/useSiteContent";
// Grabado en azul hecho a partir de la foto del Palacio de López que mandó la
// clienta.
import palacio from "@/assets/palacio-grabado-2.webp";

const HERO_KEYS: SiteContentKey[] = ["inicio.title", "inicio.lead", "inicio.button"];

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";
/** Entrada del texto: sube y aparece; cada pieza suma su retardo. */
const enter = `motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-700 ${ease}`;

/**
 * Portada como el boceto de la clienta: bloque azul tinta con la bienvenida y,
 * debajo, el Palacio de López en grabado azul sobre blanco. Justo después
 * viene la franja de íconos de servicios (ServicesShowcase).
 */
export function Hero() {
  const t = useSiteContent(HERO_KEYS);
  return (
    <section id="inicio" className="bg-surface">
      {/* El azul ocupa toda la pantalla, debajo del menú (72px). */}
      <div className="flex min-h-[calc(100svh-72px)] items-center bg-ink text-on-navy">
        <Container className="grid w-full content-center gap-6 py-14 md:gap-7 md:py-16 lg:py-20">
          <h1 className="max-w-[20ch] font-display text-[38px] leading-[44px] font-semibold tracking-tight sm:text-[48px] sm:leading-[54px] lg:text-[60px] lg:leading-[66px]">
            <span className={`block ${enter}`}>{t["inicio.title"]}</span>
          </h1>
          <p className={`max-w-[38rem] text-[18px] leading-[28px] text-on-navy-muted sm:text-[20px] sm:leading-[31px] motion-safe:delay-200 ${enter}`}>
            {t["inicio.lead"]}
          </p>
          <div className={`motion-safe:delay-500 ${enter}`}>
            <Button asChild variant="onNavy" size="lg" className="group text-blue">
              <Link to="/servicios">
                {t["inicio.button"]}
                <ArrowRight
                  className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </Container>
      </div>

      <div className="pt-5 md:pt-7">
        {/* En celular el dibujo va de borde a borde, como en el boceto. */}
        <div className="mx-auto max-w-[1180px] md:px-6">
          <img
            src={palacio}
            alt="Palacio de López, en Asunción, dibujado en azul"
            width={1800}
            height={1097}
            className={`mx-auto block h-auto w-full max-w-[880px] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both motion-safe:delay-300 motion-safe:duration-1000 ${ease}`}
          />
        </div>
      </div>
    </section>
  );
}
