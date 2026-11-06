import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Factory,
  KeyRound,
  Leaf,
  Scale,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { StairsIcon } from "@/components/primitives/StairsIcon";
import { TwoToneIcon } from "@/components/primitives/TwoToneIcon";
import { Button } from "@/components/ui/button";
import { useCarousel } from "@/hooks/useCarousel";
import { usePath, useT } from "@/i18n/context";
import type { Messages } from "@/i18n/messages";
import { cn } from "@/lib/utils";

/**
 * Las 4 áreas de los flyers de VDM y los 2 servicios con texto propio que
 * mandó la clienta. Cada uno lleva a su área en /servicios.
 */
const services: Array<{ key: keyof Messages["home"]["showcase"]; icon: LucideIcon; area: string }> = [
  { key: "juridico", icon: Scale, area: "juridico" },
  { key: "consultoria", icon: Building2, area: "consultoria" },
  { key: "inversiones", icon: StairsIcon, area: "inversiones" },
  { key: "habilitaciones", icon: Factory, area: "habilitaciones" },
  { key: "ambientales", icon: Leaf, area: "habilitaciones" },
  { key: "inmobiliarias", icon: KeyRound, area: "inversiones" },
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
  const t = useT();
  const path = usePath();

  return (
    <section id="servicios" className="bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-12 flex items-center justify-between gap-4 md:mb-16">
          <h2 className="font-display text-[30px] leading-[36px] font-medium text-blue md:text-[44px] md:leading-[52px]">
            {t.home.servicesTitle}
          </h2>
          <Button asChild variant="outline" className="border-blue text-blue">
            <Link to={path("servicios")}>{t.home.readMore}</Link>
          </Button>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label={t.home.prev}
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className={cn(arrowClass, "left-0 hidden md:grid")}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
          <ul
            ref={trackRef}
            className="m-0 grid list-none grid-cols-3 gap-y-8 p-0 md:flex md:snap-x md:snap-mandatory md:overflow-x-auto md:scroll-smooth md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden"
          >
            {services.map(({ key, icon, area }) => (
              <li
                key={key}
                data-card
                className="min-w-0 md:w-1/6 md:shrink-0 md:snap-start"
              >
                <Link
                  to={path("servicios", area)}
                  className="group grid justify-items-center gap-3 px-1 text-center md:gap-5 md:px-2"
                >
                  <span className="transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1">
                    <TwoToneIcon icon={icon} className="size-16 sm:size-20 md:size-28" />
                  </span>
                  <span className="max-w-[180px] font-display text-[13px] leading-[18px] text-blue sm:text-base sm:leading-6 md:text-lg md:leading-7">
                    {t.home.showcase[key]}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-label={t.home.next}
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className={cn(arrowClass, "right-0 hidden md:grid")}
          >
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </section>
  );
}
