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
      <section className="relative bg-navy py-14 text-on-navy md:py-20">
        {/* Línea naranja superior a lo ancho (sello institucional, estilo PKF). */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-orange"
        />
        <Container className="grid max-w-[760px] gap-6">
          <p className="text-body text-on-navy-muted md:text-lead">
            Acompañamos la planificación, instalación y desarrollo de nuevas
            inversiones en Paraguay, así como el crecimiento, fortalecimiento
            y gestión de empresas ya consolidadas, ofreciendo asesoría
            permanente, soluciones estratégicas y seguridad jurídica para sus
            operaciones.
          </p>
          <p className="font-semibold text-on-navy">
            Contamos con un equipo multidisciplinario de profesionales en
            áreas:
          </p>
          <div className="flex flex-wrap gap-2">
            {disciplines.map((d) => (
              <span
                key={d}
                className="inline-flex items-center rounded-full border border-on-navy-muted/30 bg-white/5 px-3.5 py-1.5 text-small font-semibold text-on-navy transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-orange hover:bg-orange hover:text-on-orange hover:shadow-sm"
              >
                {d}
              </span>
            ))}
          </div>
          <p className="border-t border-white/15 pt-5 text-body text-on-navy-muted">
            {content["about.commitment"]}
          </p>
          <p className="font-display text-base font-semibold text-orange">
            VDM Consultores ·{" "}
            <span className="font-normal italic text-on-navy-muted">
              “Fortaleciendo empresas, potenciando inversiones.”
            </span>
          </p>
        </Container>
      </section>
      <PageCta
        title="¿Querés que te acompañemos?"
        body="Contanos tu proyecto y te ponemos en contacto con el área correcta."
      />
    </>
  );
}
