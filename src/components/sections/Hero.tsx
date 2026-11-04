import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import edificio from "@/assets/edificio-vdm.webp";

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";
/** Entrada del texto: sube y aparece; cada pieza suma su retardo. */
const enter = `motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:fill-mode-both motion-safe:duration-700 ${ease}`;

/**
 * Portada: fondo azul tinta, bienvenida a la izquierda y la fachada del
 * edificio de VDM a la derecha, cortada en la diagonal de la V del logo. Al
 * cargar, la foto entra desde la derecha y el texto aparece línea por línea.
 * En celular la foto va debajo del texto.
 */
export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-ink text-on-navy">
      {/* Escritorio: foto a sangre hasta el borde derecho. */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[52%] md:block">
        <div className="absolute inset-0 overflow-hidden [clip-path:polygon(22%_0,100%_0,100%_100%,8%_100%)]">
          <img
            src={edificio}
            alt=""
            width={920}
            height={1448}
            className={`h-full w-full object-cover object-[50%_30%] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-8 motion-safe:duration-1000 ${ease}`}
          />
        </div>
      </div>

      <Container className="relative grid items-center py-14 md:min-h-[560px] md:py-20 lg:min-h-[640px] lg:py-24">
        <div className="relative z-10 grid gap-6 md:w-[48%] md:gap-8">
          <h1 className="font-display text-[40px] leading-[46px] font-semibold tracking-tight sm:text-[48px] sm:leading-[54px] lg:text-[64px] lg:leading-[70px]">
            <span className={`block ${enter}`}>Bienvenidos a</span>
            <span className={`block lg:whitespace-nowrap motion-safe:delay-150 ${enter}`}>
              VDM Consultores
            </span>
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
        </div>
      </Container>

      {/* Celular: la fachada debajo del texto, con el mismo corte diagonal. */}
      <div aria-hidden="true" className="relative h-[380px] sm:h-[460px] md:hidden">
        <div className="absolute inset-0 overflow-hidden [clip-path:polygon(0_10%,100%_40%,100%_100%,0_100%)]">
          <img
            src={edificio}
            alt=""
            width={920}
            height={1448}
            loading="lazy"
            className="h-full w-full object-cover object-[50%_35%]"
          />
        </div>
      </div>
    </section>
  );
}
