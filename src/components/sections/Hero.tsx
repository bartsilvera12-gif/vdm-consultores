import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import { useSiteContent, type SiteContentKey } from "@/hooks/useSiteContent";
import { usePath, useT } from "@/i18n/context";
// Palacio de López dibujado en azul, la ilustración que mandó la clienta.
import palacio from "@/assets/palacio-ilustracion.webp";

const HERO_KEYS: SiteContentKey[] = ["inicio.title", "inicio.lead", "inicio.button"];

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";
/** Entrada del texto: sube y aparece; cada pieza suma su retardo. */
const enter = `motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-700 ${ease}`;

/**
 * Portada: bloque azul tinta con la bienvenida y el Palacio de López.
 * En escritorio el dibujo ocupa la mitad derecha, cortado en diagonal; en
 * celular va debajo del bloque azul, entero. Después vienen los íconos de
 * servicios (ServicesShowcase).
 */
export function Hero() {
  const t = useSiteContent(HERO_KEYS);
  const m = useT();
  const path = usePath();
  return (
    <section id="inicio" className="bg-surface">
      {/* El azul ocupa toda la pantalla, debajo del menú (72px). */}
      <div className="relative flex items-center overflow-hidden bg-ink text-on-navy md:min-h-[calc(100svh-72px)]">
        <Container className="relative z-10 grid w-full content-center gap-6 py-14 md:gap-7 md:py-16 lg:py-20">
          <div className="grid gap-6 md:max-w-[46%] md:gap-7">
            <h1 className="max-w-[20ch] font-display text-[38px] leading-[44px] font-semibold tracking-tight sm:text-[48px] sm:leading-[54px] lg:text-[60px] lg:leading-[66px]">
              <span className={`block ${enter}`}>{t["inicio.title"]}</span>
            </h1>
            <p className={`max-w-[38rem] text-[18px] leading-[28px] text-on-navy-muted sm:text-[20px] sm:leading-[31px] motion-safe:delay-200 ${enter}`}>
              {t["inicio.lead"]}
            </p>
            <div className={`motion-safe:delay-500 ${enter}`}>
              <Button asChild variant="onNavy" size="lg" className="group text-blue">
                <Link to={path("servicios")}>
                  {t["inicio.button"]}
                  <ArrowRight
                    className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </Container>

        {/* Escritorio: mitad derecha, con el borde izquierdo en diagonal. */}
        <div
          aria-hidden="true"
          className={`absolute inset-y-0 right-0 hidden w-[52%] bg-surface [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)] md:block motion-safe:animate-in motion-safe:fade-in motion-safe:fill-mode-both motion-safe:delay-300 motion-safe:duration-1000 ${ease}`}
        >
          <img
            src={palacio}
            alt=""
            width={1774}
            height={887}
            className="h-full w-full object-cover object-[58%_center]"
          />
        </div>
      </div>

      {/* Celular: el dibujo entero debajo del bloque azul. */}
      <div className="md:hidden">
        <img
          src={palacio}
          alt={m.home.palaceAlt}
          width={1774}
          height={887}
          className={`block h-auto w-full motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both motion-safe:delay-300 motion-safe:duration-1000 ${ease}`}
        />
      </div>
    </section>
  );
}
