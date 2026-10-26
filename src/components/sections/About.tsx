import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";

const disciplines = [
  "Jurídica",
  "Tributaria",
  "Empresarial",
  "Ambiental",
  "Migratoria",
  "Industrial",
  "Comercio exterior",
];

export function About() {
  return (
    <Section id="nosotros">
      <div className="grid gap-10 md:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-18">
        <div className="grid max-w-[620px] gap-5">
          <Eyebrow>Quiénes somos</Eyebrow>
          <h2 className="font-display text-[28px] leading-[34px] font-semibold tracking-h2 md:text-h2 md:leading-h2">
            Un solo equipo, soluciones integrales.
          </h2>
          <p className="text-lead text-ink-muted">
            Somos VDM Consultores, una firma paraguaya de consultoría jurídica,
            empresarial y de inversiones, especializada en brindar asesoramiento
            integral a empresas e inversionistas nacionales y extranjeros.
          </p>
          <p className="text-body text-ink-muted">
            Acompañamos la planificación, instalación y desarrollo de nuevas
            inversiones en Paraguay, así como el crecimiento, fortalecimiento y
            gestión de empresas ya consolidadas, con asesoría jurídica
            permanente, soluciones estratégicas y seguridad jurídica para sus
            operaciones.
          </p>
          <div>
            <p className="font-semibold">
              Equipo multidisciplinario en las áreas:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {disciplines.map((d) => (
                <span
                  key={d}
                  className="rounded-sm border border-line bg-surface px-3 py-1.5 text-small text-ink"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
          <p className="mt-2 border-t border-line pt-5 text-body text-ink-muted">
            Nuestro compromiso es brindar un servicio profesional, personalizado
            e integral, orientado a proteger los intereses de nuestros clientes,
            fortalecer sus estructuras empresariales y potenciar sus proyectos
            de inversión.
          </p>
        </div>
        <div className="grid content-start gap-4">
          <Pillar
            title="Fortaleciendo empresas"
            body="Mediante protección jurídica, asesoramiento tributario, cumplimiento normativo y acompañamiento empresarial permanente."
            orientation="rect-first"
          />
          <Pillar
            title="Potenciando inversiones"
            body="Mediante planificación estratégica, obtención de incentivos fiscales, estructuración de proyectos, instalación de empresas y desarrollo de inversiones nacionales y extranjeras."
            orientation="triangle-first"
          />
        </div>
      </div>
    </Section>
  );
}

function Pillar({
  title,
  body,
  orientation,
}: {
  title: string;
  body: string;
  orientation: "rect-first" | "triangle-first";
}) {
  return (
    <article className="relative grid gap-3 overflow-hidden rounded-lg bg-surface-alt p-7">
      <svg
        className="h-6 w-9"
        viewBox="0 0 36 24"
        aria-hidden="true"
      >
        {orientation === "rect-first" ? (
          <>
            <rect x="0" y="4" width="22" height="16" rx="2" fill="var(--vdm-blue)" />
            <path d="M24 4h12L30 20z" fill="var(--vdm-orange)" />
          </>
        ) : (
          <>
            <path d="M0 4h12l6 16z" fill="var(--vdm-orange)" />
            <rect x="14" y="4" width="22" height="16" rx="2" fill="var(--vdm-blue)" />
          </>
        )}
      </svg>
      <h3 className="font-display text-h3 leading-h3 font-semibold text-ink">
        {title}
      </h3>
      <p className="text-body text-ink-muted">{body}</p>
    </article>
  );
}
