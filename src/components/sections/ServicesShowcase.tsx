import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Factory,
  House,
  Leaf,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { StairsIcon } from "@/components/primitives/StairsIcon";
import { TwoToneIcon } from "@/components/primitives/TwoToneIcon";
import { Button } from "@/components/ui/button";
import { useCarousel } from "@/hooks/useCarousel";
import { cn } from "@/lib/utils";

/**
 * Las 4 áreas de los flyers de VDM y los 2 servicios con texto propio que
 * mandó la clienta. Cada uno lleva a su área en /servicios.
 */
const services: Array<{ label: string; icon: LucideIcon; area: string }> = [
  { label: "Estudio Jurídico", icon: Scale, area: "juridico" },
  { label: "Consultoría Empresarial", icon: Building2, area: "consultoria" },
  { label: "Asesoría en Inversiones", icon: StairsIcon, area: "inversiones" },
  { label: "Habilitaciones Industriales y Comerciales", icon: Factory, area: "habilitaciones" },
  { label: "Licencias Ambientales", icon: Leaf, area: "habilitaciones" },
  { label: "Inversiones Inmobiliarias", icon: House, area: "inversiones" },
];

const arrowClass =
  "absolute top-[48px] z-10 grid h-12 w-14 place-items-center rounded-lg bg-surface-alt text-blue shadow-card transition-[opacity,background-color] hover:bg-line disabled:pointer-events-none disabled:opacity-0 md:top-[56px]";

/**
 * Servicios de la portada (referencia aprobada: PKF Paraguay): íconos de
 * línea en fila con flechas a los lados y "Leer más" hacia /servicios.
 */
export function ServicesShowcase() {
  const { trackRef, canPrev, canNext, scrollByCard } =
    useCarousel<HTMLUListElement>();

  return (
    <section id="servicios" className="bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-12 flex items-center justify-between gap-4 md:mb-16">
          <h2 className="font-display text-[30px] leading-[36px] font-medium text-blue md:text-[44px] md:leading-[52px]">
            Servicios
          </h2>
          <Button asChild variant="outline" className="border-blue text-blue">
            <Link to="/servicios">Leer más</Link>
          </Button>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="Anterior"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className={cn(arrowClass, "left-0")}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <ul
            ref={trackRef}
            className="m-0 flex snap-x snap-mandatory list-none overflow-x-auto scroll-smooth p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {services.map(({ label, icon, area }) => (
              <li
                key={label}
                data-card
                className="w-1/2 shrink-0 snap-start sm:w-1/3 md:w-1/6"
              >
                <Link
                  to={`/servicios#${area}`}
                  className="group grid justify-items-center gap-5 px-2 text-center"
                >
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1">
                    <TwoToneIcon icon={icon} className="size-24 md:size-28" />
                  </span>
                  <span className="max-w-[180px] font-display text-base leading-6 text-blue md:text-lg md:leading-7">
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label="Siguiente"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className={cn(arrowClass, "right-0")}
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </section>
  );
}
