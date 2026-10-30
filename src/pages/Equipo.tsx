import { User } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { useTeam } from "@/hooks/useTeam";

export function Equipo() {
  const { members } = useTeam();
  const allPlaceholders =
    members.length > 0 && members.every((m) => m.name === "Nombre y apellido");

  return (
    <>
      <PageHero
        eyebrow="Equipo profesional"
        title="Profesionales especializados en cada área."
        lead="Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente."
      />
      <section className="bg-surface-alt py-14 md:py-20">
        <Container>
          <div
            className="grid gap-4 sm:gap-5"
            style={{
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(200px,100%), 1fr))",
            }}
          >
            {members.map((member, i) => (
              <article
                key={member.id ?? i}
                className="grid gap-3 rounded-lg border border-line bg-surface p-4 shadow-card"
              >
                <div className="grid aspect-[4/5] max-w-full place-items-center overflow-hidden rounded-md border border-dashed border-line-strong bg-surface-alt p-4 text-center text-small text-ink-muted">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      loading="lazy"
                      className="h-full w-full rounded-md object-cover"
                    />
                  ) : (
                    <div>
                      <User
                        className="mx-auto mb-2 block size-10 text-line-strong"
                        aria-hidden="true"
                      />
                      Fotografía autorizada
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold leading-6 text-ink">
                    {member.name}
                  </h2>
                  <p className="text-small text-ink-muted">{member.role}</p>
                </div>
              </article>
            ))}
          </div>
          {allPlaceholders && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-1.5 text-small text-ink-muted">
              <span className="block size-2 shrink-0 rounded-full bg-blue" />
              Perfiles, cargos y fotografías a completar con el material que
              entregue VDM.
            </p>
          )}
        </Container>
      </section>
      <PageCta
        title="¿Querés hablar con un profesional del equipo?"
        body="Contanos tu caso y te derivamos al área correcta."
      />
    </>
  );
}
