import { useMemo } from "react";
import { Container } from "@/components/primitives/Container";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { useDisciplines } from "@/hooks/useDisciplines";
import { useSiteContent } from "@/hooks/useSiteContent";

export function Nosotros() {
  const keys = useMemo(() => ["about.commitment" as const], []);
  const content = useSiteContent(keys);
  const { disciplines } = useDisciplines();

  return (
    <>
      <PageHero
        eyebrow="Quiénes somos"
        title="Un solo equipo, soluciones integrales."
      />
      <section className="bg-surface-alt py-14 text-ink md:py-20">
        <Container className="max-w-[820px]">
          <div className="relative grid gap-6 overflow-hidden rounded-lg border border-line bg-surface p-6 shadow-card sm:p-8 md:p-10">
            {/* Línea azul superior a lo ancho (sello institucional, estilo PKF). */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-blue-bright"
            />
            <p className="text-body text-ink-muted md:text-lead">
            Acompañamos la planificación, instalación y desarrollo de nuevas
            inversiones en Paraguay, así como el crecimiento, fortalecimiento
            y gestión de empresas ya consolidadas, ofreciendo asesoría
            permanente, soluciones estratégicas y seguridad jurídica para sus
            operaciones.
          </p>
          <p className="font-semibold text-ink">
            Contamos con un equipo multidisciplinario de profesionales en
            áreas:
          </p>
          <div className="flex flex-wrap gap-2">
            {disciplines.map((d) => (
              <span
                key={d}
                className="inline-flex items-center rounded-full border border-line bg-surface-alt px-3.5 py-1.5 text-small font-semibold text-ink transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-blue hover:bg-blue hover:text-on-blue hover:shadow-sm"
              >
                {d}
              </span>
            ))}
          </div>
          <p className="border-t border-line pt-5 text-body text-ink-muted">
            {content["about.commitment"]}
          </p>
            <p className="font-display text-base font-semibold text-blue">
              VDM Consultores ·{" "}
              <span className="font-normal italic text-ink-muted">
                “Fortaleciendo empresas, potenciando inversiones.”
              </span>
            </p>
          </div>
        </Container>
      </section>
      <PageCta
        title="¿Querés que te acompañemos?"
        body="Contanos tu proyecto y te ponemos en contacto con el área correcta."
      />
    </>
  );
}
