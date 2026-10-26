import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Button } from "@/components/ui/button";
import { areas } from "@/content/areas";
import { cn } from "@/lib/utils";

const trustPoints = [
  "Equipo multidisciplinario",
  "Clientes nacionales y extranjeros",
  "Asesoría permanente",
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden border-b border-line bg-surface"
    >
      <Container className="relative grid items-center gap-10 py-12 pb-16 md:gap-14 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
        {/* Copy ------------------------------------------------------------- */}
        <div className="grid min-w-0 gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
          <div className="flex items-center gap-3">
            <span className="h-[3px] w-10 bg-orange" aria-hidden="true" />
            <Eyebrow>VDM Consultores · Paraguay</Eyebrow>
          </div>
          <h1 className="font-display text-[40px] leading-[44px] font-bold tracking-tight text-ink md:text-[62px] md:leading-[64px]">
            Fortaleciendo empresas,{" "}
            <em className="block not-italic text-blue">
              potenciando inversiones<span className="text-orange">.</span>
            </em>
          </h1>
          <p className="max-w-[540px] text-lead text-ink-muted">
            Firma paraguaya de consultoría jurídica, empresarial y de
            inversiones. Acompañamos a empresas e inversionistas nacionales y
            extranjeros con asesoramiento integral y seguridad jurídica en cada
            decisión.
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            <Button asChild>
              <a href="#contacto">
                Agenda tu consulta
                <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="#servicios">Conoce nuestros servicios</a>
            </Button>
          </div>
          <ul
            role="list"
            className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-small text-ink-muted"
          >
            {trustPoints.map((point) => (
              <li key={point} className="inline-flex items-center gap-2">
                <Check className="size-4 text-blue" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Dossier panel --------------------------------------------------- */}
        <div className="relative min-w-0">
          <span
            aria-hidden="true"
            className="absolute left-[18%] top-[-24px] bottom-[12%] w-14 origin-top -skew-x-[16deg] bg-orange motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-4 motion-safe:duration-700"
          />
          <div
            className={cn(
              "relative rounded-lg bg-navy p-8 pb-5 text-on-navy md:p-10 md:pb-6",
              "lg:[clip-path:polygon(14%_0,100%_0,100%_100%,0_100%,0_9%)]",
              "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-500",
            )}
          >
            <span
              aria-hidden="true"
              className="absolute right-0 top-0 bottom-0 w-2.5 bg-blue-bright"
            />
            <Eyebrow tone="onNavy">Áreas de servicio</Eyebrow>
            <p className="mt-2.5 mb-5 font-display text-h3 leading-h3 font-semibold text-on-navy">
              Un solo equipo, soluciones integrales.
            </p>
            <ul className="m-0 list-none p-0">
              {areas.map((area) => {
                const Icon = area.icon;
                return (
                  <li key={area.id}>
                    <a
                      href={`#${area.id}`}
                      className="group grid grid-cols-[40px_1fr_18px] items-center gap-3.5 border-t border-white/15 py-4 text-on-navy"
                    >
                      <span className="grid size-10 place-items-center rounded-md bg-white/10 text-orange">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-base font-semibold leading-[21px]">
                          {area.eyebrow.replace(
                            " Industriales y Comerciales",
                            "",
                          )}
                        </span>
                        <span className="mt-0.5 block font-sans text-small text-on-navy-muted">
                          {area.summary}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 text-on-navy-muted transition-[transform,color] duration-200 group-hover:translate-x-1 group-hover:text-orange"
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
