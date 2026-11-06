import { Link } from "react-router-dom";
import { Building2, KeyRound, Leaf, Scale, Ship } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { usePath, useT } from "@/i18n/context";
import type { Messages } from "@/i18n/messages";
// Fotos de Unsplash (licencia libre de Unsplash, uso comercial sin atribución).
import fotoJuridico from "@/assets/servicios/juridico.webp";
import fotoEmpresarial from "@/assets/servicios/empresarial.webp";
import fotoAmbiental from "@/assets/servicios/ambiental.webp";
import fotoComercio from "@/assets/servicios/comercio.webp";
import fotoInmobiliarias from "@/assets/servicios/inmobiliarias.webp";

const areas: Array<{ key: keyof Messages["about"]["strip"]; icon: typeof Scale; photo: string }> = [
  { key: "juridico", icon: Scale, photo: fotoJuridico },
  { key: "empresarial", icon: Building2, photo: fotoEmpresarial },
  { key: "ambiental", icon: Leaf, photo: fotoAmbiental },
  { key: "comercio", icon: Ship, photo: fotoComercio },
  { key: "inmobiliarias", icon: KeyRound, photo: fotoInmobiliarias },
];

/**
 * "Nuestros servicios" de /nosotros: cinco tarjetas con una foto de fondo
 * teñida de azul y el ícono encima, a /servicios.
 */
export function AreasStrip() {
  const t = useT();
  const path = usePath();
  return (
    <section className="bg-surface-alt py-10 md:py-24">
      <Container>
        <div className="mb-5 grid gap-3 sm:mb-8">
          <h2 className="font-display text-[20px] leading-[26px] font-bold tracking-h2 text-ink sm:text-[28px] sm:leading-[34px] md:text-h2 md:leading-h2">
            {t.about.ourServices}
          </h2>
          <span className="h-[3px] w-12 bg-sky" aria-hidden="true" />
        </div>
        <ul className="m-0 grid list-none grid-cols-5 gap-1.5 p-0 sm:gap-4">
          {areas.map(({ key, icon: Icon, photo }) => (
            <li key={key} className="min-w-0">
              <Link
                to={path("servicios")}
                className="group relative isolate grid h-full min-h-[96px] content-center justify-items-center gap-2 overflow-hidden rounded-lg bg-navy px-1 py-3 text-center sm:min-h-[170px] sm:gap-3 sm:px-3 sm:py-6"
              >
                {/* Foto teñida: escala de grises mezclada con el azul de fondo. */}
                <img
                  src={photo}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35 mix-blend-luminosity transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-105 group-hover:opacity-50"
                />
                <Icon
                  className="size-6 text-on-navy sm:size-9"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="max-w-full font-display text-[10.5px] leading-[13px] font-semibold text-on-navy hyphens-auto [overflow-wrap:anywhere] sm:text-small lg:hyphens-none lg:[overflow-wrap:normal] md:text-base">
                  {t.about.strip[key]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
