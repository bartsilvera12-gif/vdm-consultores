import { User } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { useAreas } from "@/hooks/useAreas";
import { useTeam } from "@/hooks/useTeam";
import { cn } from "@/lib/utils";

export function Equipo() {
  const { members } = useTeam();
  const { areas } = useAreas();
  const allPlaceholders =
    members.length > 0 && members.every((m) => m.name === "Nombre y apellido");

  return (
    <>
      <PageHero
        eyebrow="Equipo profesional"
        title="Profesionales especializados en cada área"
        lead="Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente."
      />
      <section className="bg-surface-alt py-16 md:py-24">
        <Container>
          <div className="grid items-start gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:gap-8">
            {/* Panel navy — áreas que cubre el equipo --------------------- */}
            <aside className="relative overflow-hidden rounded-xl bg-navy p-7 text-on-navy shadow-card sm:p-9 md:p-10 lg:sticky lg:top-24">
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

            {/* Integrantes: primero las tres de cuerpo entero (día a día),
                después el resto, en el orden que cargó la clienta. ------ */}
            <div className="grid gap-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                {members.slice(0, 3).map((member, i) => (
                  <MemberCard key={member.id ?? i} member={member} featured />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:gap-5 xl:grid-cols-3">
                {members.slice(3).map((member, i) => (
                  <MemberCard key={member.id ?? i} member={member} />
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
      <PageCta />
    </>
  );
}

function MemberCard({
  member,
  featured = false,
}: {
  member: { name: string; role: string; photo?: string };
  featured?: boolean;
}) {
  return (
    <Reveal as="article" className="grid content-start gap-3 rounded-xl border border-line bg-surface p-3 shadow-card sm:p-4">
      <div
        className={cn(
          "grid max-w-full place-items-center overflow-hidden rounded-lg text-center text-small text-ink-muted",
          // Cuerpo entero: alto y recortado arriba. El resto: foto completa
          // sobre blanco, como en el boceto (fondo blanco de los retratos).
          featured ? "aspect-[3/5] bg-surface-alt" : "aspect-[4/3] bg-white",
        )}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className={cn(
              "h-full w-full rounded-lg",
              featured ? "object-cover object-top" : "object-contain",
            )}
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
    </Reveal>
  );
}
