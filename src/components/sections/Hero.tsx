import { Link } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import giselleLaptop from "@/assets/equipo/giselle-laptop.webp";

/** Rayos finos alrededor de la foto, de un radio interno a uno externo. */
function Rays() {
  const lines = Array.from({ length: 140 }, (_, i) => {
    const a = (i / 140) * Math.PI * 2;
    const r1 = 330 + (i % 3) * 18;
    const r2 = 760;
    return {
      x1: 800 + Math.cos(a) * r1,
      y1: 800 + Math.sin(a) * r1,
      x2: 800 + Math.cos(a) * r2,
      y2: 800 + Math.sin(a) * r2,
    };
  });
  return (
    <svg
      viewBox="0 0 1600 1600"
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[230%] w-[230%] -translate-x-1/2 -translate-y-1/2"
    >
      <g stroke="var(--vdm-sky)" strokeWidth="1.4" opacity="0.45">
        {lines.map((l, i) => (
          <line key={i} {...l} />
        ))}
      </g>
    </svg>
  );
}

/**
 * Portada: fondo azul con rayos, bienvenida a la izquierda y foto redonda a
 * la derecha (referencia aprobada: portada de PKF Paraguay).
 */
export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-blue text-on-blue">
      <Container className="relative grid items-center gap-12 py-14 md:py-20 md:min-h-[560px] md:grid-cols-[1.15fr_0.85fr] md:gap-8 lg:min-h-[640px] lg:py-24">
        <div className="relative z-10 grid gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 md:gap-8">
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

        <div className="relative mx-auto w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[460px]">
          <Rays />
          <div className="relative aspect-square overflow-hidden rounded-full motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700">
            <img
              src={giselleLaptop}
              alt="Mgtr. Giselle Vera, directora general de VDM Consultores, trabajando en la oficina"
              width={1024}
              height={1536}
              className="h-full w-full object-cover object-[50%_45%]"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
