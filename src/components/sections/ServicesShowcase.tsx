import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Button } from "@/components/ui/button";
import { useAreas } from "@/hooks/useAreas";

/**
 * Showcase de áreas para la portada (inspirado en PKF): carrusel horizontal de
 * íconos, cada uno con un halo de luz que late y un destello al pasar el mouse.
 * Usa el contenido existente de áreas; enlaza a /servicios.
 */
export function ServicesShowcase() {
  const { areas } = useAreas();
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? (card.offsetWidth + 24) * 2 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  return (
    <section id="servicios" className="bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="grid max-w-[640px] gap-4">
            <Eyebrow>Qué hacemos</Eyebrow>
            <h2 className="font-display text-[28px] leading-[34px] font-semibold tracking-h2 md:text-h2 md:leading-h2">
              Cuatro áreas, un mismo acompañamiento.
            </h2>
            <p className="text-lead text-ink-muted">
              Un solo equipo multidisciplinario para que tu empresa o inversión
              crezca con seguridad jurídica y una estrategia clara.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => scrollByCard(-1)}
              className="grid size-11 place-items-center rounded-full border border-line bg-surface text-blue transition-colors hover:border-blue hover:bg-blue hover:text-on-blue"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => scrollByCard(1)}
              className="grid size-11 place-items-center rounded-full border border-line bg-surface text-blue transition-colors hover:border-blue hover:bg-blue hover:text-on-blue"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ul
          ref={trackRef}
          className="m-0 flex snap-x snap-mandatory list-none gap-6 overflow-x-auto scroll-smooth p-0 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {areas.map((area, i) => {
            const Icon = area.icon;
            return (
              <li
                key={area.id}
                data-card
                className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc(25%-18px)]"
              >
                <Link
                  to={`/servicios#${area.id}`}
                  className="group grid justify-items-center gap-4 rounded-xl px-2 py-5 text-center transition-colors"
                >
                  <span className="relative grid size-24 place-items-center">
                    {/* Halo de luz que late detrás del ícono. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 size-[104px] rounded-full bg-blue-bright/55 blur-2xl motion-safe:animate-[vdm-glow-pulse_3.4s_ease-in-out_infinite] motion-reduce:opacity-50"
                      style={{ animationDelay: `${i * 0.35}s` }}
                    />
                    {/* Círculo del ícono con destello al hover. */}
                    <span className="relative grid size-24 place-items-center overflow-hidden rounded-full border border-line bg-surface text-blue shadow-card transition-[transform,box-shadow,background-color,color] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5 group-hover:border-blue group-hover:bg-blue group-hover:text-on-blue group-hover:shadow-[0_0_32px_rgba(17,104,184,0.55)]">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-0 group-hover:opacity-100 group-hover:motion-safe:animate-[vdm-shine_0.9s_ease-out]"
                      />
                      <Icon className="relative size-10" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="font-display text-base font-semibold leading-5 text-ink transition-colors group-hover:text-blue">
                    {area.eyebrow}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/servicios">
              Ver todos los servicios
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/nosotros">Conocé la firma</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
