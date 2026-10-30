import { useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { useAreas } from "@/hooks/useAreas";

/**
 * Carrusel horizontal de áreas (inspirado en PKF): tarjetas con ícono en círculo
 * azul, título y resumen, con flechas de navegación. Desliza con scroll-snap y
 * los botones mueven el viewport de a una tarjeta. Usa el contenido existente.
 */
export function ServicesCarousel() {
  const { areas } = useAreas();
  const trackRef = useRef<HTMLUListElement>(null);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  return (
    <section className="bg-surface-alt py-14 md:py-20">
      <Container>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="grid max-w-[640px] gap-3">
            <Eyebrow>Áreas de servicio</Eyebrow>
            <h2 className="font-display text-[26px] leading-[32px] font-semibold tracking-h2 md:text-[32px] md:leading-[38px]">
              Un equipo para cada necesidad.
            </h2>
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
          className="m-0 flex snap-x snap-mandatory list-none gap-4 overflow-x-auto scroll-smooth p-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <li
                key={area.id}
                data-card
                className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-12px)]"
              >
                <Link
                  to={`/servicios#${area.id}`}
                  className="group grid h-full content-start gap-4 rounded-lg border border-line bg-surface p-6 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-blue/10 text-blue transition-colors group-hover:bg-blue group-hover:text-on-blue">
                    <Icon className="size-7" aria-hidden="true" />
                  </span>
                  <span className="block font-display text-base font-semibold leading-6 text-ink">
                    {area.eyebrow}
                  </span>
                  <span className="block text-small leading-[22px] text-ink-muted">
                    {area.summary}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-small font-semibold text-blue">
                    Ver más
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
