import { Link } from "react-router-dom";
import { Boxes, Building2, House, Leaf, Scale } from "lucide-react";
import { Container } from "@/components/primitives/Container";

const areas = [
  { label: "Jurídico", icon: Scale },
  { label: "Empresarial", icon: Building2 },
  { label: "Ambiental", icon: Leaf },
  { label: "Comercio Exterior", icon: Boxes },
  { label: "Inversiones Inmobiliarias", icon: House },
];

/** "Áreas de servicio" de la portada: cinco tarjetas con ícono, a /servicios. */
export function AreasStrip() {
  return (
    <section className="bg-surface-alt py-10 md:py-24">
      <Container>
        <div className="mb-5 grid gap-3 sm:mb-8">
          <h2 className="font-display text-[20px] leading-[26px] font-bold tracking-h2 text-ink sm:text-[28px] sm:leading-[34px] md:text-h2 md:leading-h2">
            Áreas de servicio
          </h2>
          <span className="h-[3px] w-12 bg-sky" aria-hidden="true" />
        </div>
        <ul className="m-0 grid list-none grid-cols-5 gap-1.5 p-0 sm:gap-4">
          {areas.map(({ label, icon: Icon }) => (
            <li key={label} className="min-w-0">
              <Link
                to="/servicios"
                className="group grid h-full content-center justify-items-center gap-2 rounded-lg border border-line bg-surface px-1 py-3 text-center shadow-card transition-[transform,border-color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-blue sm:gap-3 sm:px-3 sm:py-6"
              >
                <Icon
                  className="size-6 text-blue sm:size-9"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="font-display text-[10.5px] leading-[13px] font-medium text-ink sm:text-small md:text-base">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
