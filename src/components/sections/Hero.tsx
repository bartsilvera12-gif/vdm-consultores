import { Link } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import edificio from "@/assets/edificio-vdm.webp";
import giselleLaptop from "@/assets/equipo/giselle-laptop.webp";

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * Portada: fondo azul tinta, bienvenida a la izquierda y a la derecha dos fotos
 * enmarcadas que se superponen: la fachada del edificio de VDM y la directora
 * trabajando. Entran escalonadas al cargar.
 */
export function Hero() {
  return (
    <section id="inicio" className="overflow-hidden bg-ink text-on-navy">
      <Container className="grid items-center gap-12 py-14 md:min-h-[560px] md:grid-cols-[1fr_0.95fr] md:gap-10 md:py-20 lg:min-h-[640px] lg:py-24">
        <div className="grid gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 md:gap-8">
          <h1 className="font-display text-[40px] leading-[46px] font-semibold tracking-tight sm:text-[48px] sm:leading-[54px] lg:text-[64px] lg:leading-[70px]">
            <span className="block">Bienvenidos a</span>
            <span className="block lg:whitespace-nowrap">VDM Consultores</span>
          </h1>
          <p className="font-display text-small font-medium uppercase tracking-[0.06em] text-on-navy-muted sm:text-base">
            Fortaleciendo empresas, potenciando inversiones
          </p>
          <div>
            <Button asChild variant="onNavy" size="lg" className="text-blue">
              <Link to="/contacto">Contáctanos</Link>
            </Button>
          </div>
        </div>

        <div aria-hidden="true" className="relative mx-auto h-[380px] w-full max-w-[480px] sm:h-[460px] md:h-[460px] lg:h-[540px] lg:max-w-[520px]">
          <img
            src={edificio}
            alt=""
            width={920}
            height={1448}
            className={`absolute right-0 top-0 h-[88%] w-[70%] rounded-2xl object-cover object-[50%_22%] shadow-[0_24px_60px_rgba(4,12,24,0.45)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-6 motion-safe:duration-700 ${ease}`}
          />
          <img
            src={giselleLaptop}
            alt=""
            width={1024}
            height={1536}
            className={`absolute bottom-0 left-0 h-[58%] w-[52%] rounded-2xl border-[6px] border-ink object-cover object-[50%_40%] shadow-[0_24px_60px_rgba(4,12,24,0.45)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-6 motion-safe:delay-200 motion-safe:fill-mode-both motion-safe:duration-700 ${ease}`}
          />
        </div>
      </Container>
    </section>
  );
}
