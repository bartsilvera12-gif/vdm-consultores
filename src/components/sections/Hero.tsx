import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Logo } from "@/components/primitives/Logo";
import { Button } from "@/components/ui/button";
import edificio from "@/assets/edificio-vdm.webp";

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * Portada: fondo azul tinta, bienvenida a la izquierda y la fachada del
 * edificio de VDM a la derecha, cortada en la diagonal de la V del logo, con un
 * acercamiento lento y el logo en una tarjeta blanca. En celular la foto va
 * debajo del texto.
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
            className="h-full w-full object-cover object-[50%_30%] motion-safe:animate-[vdm-kenburns_18s_ease-in-out_infinite_alternate]"
          />
        </div>
        <div
          className={`absolute bottom-10 left-[16%] rounded-xl bg-surface px-6 py-4 shadow-[0_18px_40px_rgba(6,17,30,0.35)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:delay-300 motion-safe:fill-mode-both motion-safe:duration-700 lg:bottom-14 lg:px-8 lg:py-5 ${ease}`}
        >
          <Logo width={150} height={60} className="h-11 w-auto lg:h-14" alt="" />
        </div>
      </div>

      <Container className="relative grid items-center py-14 md:min-h-[560px] md:py-20 lg:min-h-[640px] lg:py-24">
        <div className="relative z-10 grid gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 md:w-[48%] md:gap-8">
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
        <a
          href="#servicios"
          aria-label="Ver servicios"
          className="absolute bottom-6 left-[max(1rem,env(safe-area-inset-left))] hidden size-10 place-items-center rounded-full border border-white/25 text-on-navy transition-colors hover:bg-white/10 md:left-[max(3rem,env(safe-area-inset-left))] md:grid"
        >
          <ChevronDown
            className="size-5 motion-safe:animate-[vdm-nudge_1.8s_ease-in-out_infinite]"
            aria-hidden="true"
          />
        </a>
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
        <div className="absolute bottom-5 left-4 rounded-lg bg-surface px-4 py-3 shadow-[0_12px_28px_rgba(6,17,30,0.3)]">
          <Logo width={110} height={44} className="h-9 w-auto" alt="" />
        </div>
      </div>
    </section>
  );
}
