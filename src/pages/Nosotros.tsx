import { useMemo } from "react";
import { ShieldCheck, Rocket } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageCta } from "@/components/primitives/PageCta";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AreasStrip } from "@/components/sections/AreasStrip";
import { FirmHero } from "@/components/sections/FirmHero";
import { useDisciplines } from "@/hooks/useDisciplines";
import { useSiteContent } from "@/hooks/useSiteContent";

const pillars = [
  {
    icon: ShieldCheck,
    title: "Fortaleciendo empresas",
    body: "Mediante protección jurídica, asesoramiento tributario, cumplimiento normativo y acompañamiento empresarial permanente.",
  },
  {
    icon: Rocket,
    title: "Potenciando inversiones",
    body: "Mediante planificación estratégica, obtención de incentivos fiscales, estructuración de proyectos, instalación de empresas y desarrollo de inversiones nacionales y extranjeras.",
  },
];

export function Nosotros() {
  const keys = useMemo(() => ["about.commitment" as const], []);
  const content = useSiteContent(keys);
  const { disciplines } = useDisciplines();

  return (
    <>
      <AboutIntro />
      <FirmHero />
      <AreasStrip />
      <section id="la-firma" className="bg-surface-alt py-16 md:py-24">
        <Container>
          <div className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:gap-8">
            {/* Columna izquierda — relato de la firma ---------------------- */}
            <div className="relative grid gap-6 overflow-hidden rounded-xl border border-line bg-surface p-7 shadow-card sm:p-9 md:p-10">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-blue-bright"
              />
              <Eyebrow>La firma</Eyebrow>
              <p className="text-body text-ink-muted md:text-lead">
                Acompañamos la planificación, instalación y desarrollo de nuevas
                inversiones en Paraguay, así como el crecimiento, fortalecimiento
                y gestión de empresas ya consolidadas, ofreciendo asesoría
                permanente, soluciones estratégicas y seguridad jurídica para sus
                operaciones.
              </p>

              <div className="grid gap-3">
                <p className="font-display text-base font-semibold text-ink">
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
              </div>

              <p className="border-t border-line pt-6 text-body text-ink-muted">
                {content["about.commitment"]}
              </p>
              <p className="font-display text-base font-semibold text-blue">
                VDM Consultores ·{" "}
                <span className="font-normal italic text-ink-muted">
                  “Fortaleciendo empresas, potenciando inversiones.”
                </span>
              </p>
            </div>

            {/* Columna derecha — pilares de la firma (panel navy) --------- */}
            <aside className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-navy p-7 text-on-navy shadow-card sm:p-9 md:p-10">
              <div className="relative grid gap-6">
                <Eyebrow tone="onNavy">Nuestro enfoque</Eyebrow>
                <ul className="m-0 grid list-none gap-6 p-0">
                  {pillars.map((p) => {
                    const Icon = p.icon;
                    return (
                      <li
                        key={p.title}
                        className="grid grid-cols-[48px_1fr] items-start gap-4 border-t border-white/15 pt-6 first:border-t-0 first:pt-0"
                      >
                        <span className="grid size-12 place-items-center rounded-full bg-white/10 text-on-navy">
                          <Icon className="size-6" aria-hidden="true" />
                        </span>
                        <div className="grid gap-1.5">
                          <h2 className="font-display text-h3 leading-h3 font-semibold text-on-navy">
                            {p.title}
                          </h2>
                          <p className="text-small leading-[22px] text-on-navy-muted">
                            {p.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
      <PageCta />
    </>
  );
}
