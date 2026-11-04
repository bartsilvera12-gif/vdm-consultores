import { User } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { useAreas } from "@/hooks/useAreas";
import { useTeam } from "@/hooks/useTeam";

export function Equipo() {
  const { members } = useTeam();
  const { areas } = useAreas();
  const allPlaceholders =
    members.length > 0 && members.every((m) => m.name === "Nombre y apellido");

  return (
    <>
      <PageHero
        eyebrow="Equipo profesional"
        title="Profesionales especializados en cada área."
        lead="Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente."
      />
      <section className="bg-surface-alt py-16 md:py-24">
        <Container>
          <div className="grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
            {/* Panel navy — áreas que cubre el equipo --------------------- */}
            <aside className="relative overflow-hidden rounded-xl bg-navy p-7 text-on-navy shadow-card sm:p-9 md:p-10 lg:sticky lg:top-24">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-2/3 opacity-70"
              >
                <svg
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMaxYMid slice"
                  className="h-full w-full"
                >
                  <g
                    stroke="var(--vdm-blue-bright)"
                    fill="none"
                    opacity="0.3"
                    vectorEffect="non-scaling-stroke"
                  >
                    {Array.from({ length: 11 }).map((_, i) => {
                      const angle = (118 + i * 9) * (Math.PI / 180);
                      const x2 = 400 + Math.cos(angle) * 760;
                      const y2 = 120 + Math.sin(angle) * 760;
                      return (
                        <line
                          key={i}
                          x1="400"
                          y1="120"
                          x2={x2}
                          y2={y2}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                  </g>
                </svg>
              </div>
              <div className="relative grid gap-5">
                <Eyebrow tone="onNavy">Un solo equipo</Eyebrow>
                <p className="font-display text-h3 leading-h3 font-semibold text-on-navy">
                  Profesionales que cubren cada área de tu empresa o inversión.
                </p>
                <ul className="m-0 grid list-none gap-3 p-0">
                  {areas.map((area) => {
                    const Icon = area.icon;
                    return (
                      <li
                        key={area.id}
                        className="grid grid-cols-[40px_1fr] items-center gap-3 border-t border-white/15 pt-3 first:border-t-0 first:pt-0"
                      >
                        <span className="grid size-10 place-items-center rounded-full bg-white/10 text-on-navy">
                          <Icon className="size-5" aria-hidden="true" />
                        </span>
                        <span className="font-display text-base font-semibold leading-5 text-on-navy">
                          {area.eyebrow}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>

            {/* Grilla de integrantes ------------------------------------- */}
            <div className="grid gap-5">
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3">
                {members.map((member, i) => (
                  <article
                    key={member.id ?? i}
                    className="grid gap-3 rounded-xl border border-line bg-surface p-4 shadow-card"
                  >
                    <div className="grid aspect-[4/5] max-w-full place-items-center overflow-hidden rounded-lg bg-surface-alt text-center text-small text-ink-muted">
                      {member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name}
                          loading="lazy"
                          className="h-full w-full rounded-lg object-cover object-top"
                        />
                      ) : (
                        <span className="grid size-16 place-items-center rounded-full bg-blue/10 text-blue">
                          <User className="size-8" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                    <div className="border-l-[3px] border-sky pl-3">
                      <h2 className="font-display text-base font-semibold leading-6 text-ink">
                        {member.name}
                      </h2>
                      <p className="text-small text-ink-muted">{member.role}</p>
                    </div>
                  </article>
                ))}
              </div>
              {allPlaceholders && (
                <p className="inline-flex items-center gap-2 self-start rounded-full border border-line bg-surface px-4 py-2 text-small text-ink-muted">
                  <span className="block size-2 shrink-0 rounded-full bg-blue" />
                  Perfiles, cargos y fotografías a completar con el material que
                  entregue VDM.
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>
      <PageCta
        title="¿Querés hablar con un profesional del equipo?"
        body="Contanos tu caso y te derivamos al área correcta."
      />
    </>
  );
}
