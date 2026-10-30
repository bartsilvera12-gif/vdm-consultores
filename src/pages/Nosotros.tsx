import { useMemo } from "react";
import { Container } from "@/components/primitives/Container";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { useSiteContent } from "@/hooks/useSiteContent";

const disciplines = [
  "Jurídica",
  "Tributaria",
  "Empresarial",
  "Ambiental",
  "Migratoria",
  "Industrial",
  "Comercio exterior",
  "Registro de Marcas",
];

export function Nosotros() {
  const keys = useMemo(() => ["about.commitment" as const], []);
  const content = useSiteContent(keys);

  return (
    <>
      <PageHero
        eyebrow="Quiénes somos"
        title="Un solo equipo, soluciones integrales."
      />
      <section className="py-14 md:py-20">
        <Container className="grid max-w-[760px] gap-6">
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
                className="inline-flex items-center rounded-full border border-blue/20 bg-blue/5 px-3.5 py-1.5 text-small font-semibold text-blue transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-blue hover:bg-blue hover:text-white hover:shadow-sm"
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
        </Container>
      </section>
      <PageCta
        title="¿Querés que te acompañemos?"
        body="Contanos tu proyecto y te ponemos en contacto con el área correcta."
      />
    </>
  );
}
