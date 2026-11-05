import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
// Grabado en azul hecho a partir de la foto del Palacio de López de André
// Piske (Unsplash, licencia libre).
import palacio from "@/assets/palacio-grabado.webp";

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";
/** Entrada del texto: sube y aparece; cada pieza suma su retardo. */
const enter = `motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-700 ${ease}`;

/**
 * Portada como el boceto de la clienta: bloque azul tinta con la bienvenida y,
 * debajo, el Palacio de López en grabado azul sobre blanco. Justo después
 * viene la franja de íconos de servicios (ServicesShowcase).
 */
export function Hero() {
  return (
    <section id="inicio" className="bg-surface">
      <div className="bg-ink text-on-navy">
        <Container className="grid gap-6 py-14 md:gap-7 md:py-16 lg:py-20">
          <h1 className="font-display text-[40px] leading-[46px] font-semibold tracking-tight sm:text-[48px] sm:leading-[54px] lg:text-[64px] lg:leading-[70px]">
            <span className={`block ${enter}`}>Bienvenidos a</span>
            <span className={`block motion-safe:delay-150 ${enter}`}>VDM Consultores</span>
          </h1>
          <p className={`font-display text-small font-medium uppercase tracking-[0.06em] text-on-navy-muted sm:text-base motion-safe:delay-300 ${enter}`}>
            Fortaleciendo empresas, potenciando inversiones
          </p>
          <div className={`motion-safe:delay-500 ${enter}`}>
            <Button asChild variant="onNavy" size="lg" className="group text-blue">
              <Link to="/contacto">
                Contáctanos
                <ArrowRight
                  className="size-4 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </Container>
      </div>

      <div className="relative pt-5 md:pt-7">
        <span
          aria-hidden="true"
          className="absolute top-0 left-1/2 z-10 h-[3px] w-12 -translate-x-1/2 bg-sky md:w-16"
        />
        {/* En celular el dibujo va de borde a borde, como en el boceto. */}
        <div className="mx-auto max-w-[1180px] md:px-6">
          <img
            src={palacio}
            alt="Palacio de López, en Asunción, dibujado en azul"
            width={1800}
            height={1058}
            className={`mx-auto block h-auto w-full max-w-[880px] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:fill-mode-both motion-safe:delay-300 motion-safe:duration-1000 ${ease}`}
          />
        </div>
      </div>
    </section>
  );
}
