import { User } from "lucide-react";
import { Section, SectionHead } from "@/components/primitives/Section";
import { useTeam } from "@/hooks/useTeam";

export function Team() {
  const { members } = useTeam();
  // Mostramos la nota pendiente solo cuando todos los miembros aún son los
  // placeholders de ejemplo (vienen del seed o del fallback de código).
  const allPlaceholders =
    members.length > 0 && members.every((m) => m.name === "Nombre y apellido");

  return (
    <Section id="equipo" className="pt-0 md:pt-0">
      <SectionHead
        eyebrow="Equipo profesional"
        title="Profesionales especializados en cada área"
        lead="Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente."
      />
      <div
        className="grid gap-4 sm:gap-5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(160px,100%), 1fr))" }}
      >
        {members.map((member, i) => (
          <article key={member.id ?? i} className="grid gap-3">
            <div className="grid aspect-[4/5] max-w-full place-items-center overflow-hidden rounded-lg border border-dashed border-line-strong bg-surface-alt p-3 text-center text-small text-ink-muted sm:p-4">
              {member.photo ? (
                <img
                  src={member.photo}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div>
                  <User
                    className="mx-auto mb-2 block size-9 text-line-strong sm:size-11"
                    aria-hidden="true"
                  />
                  Fotografía autorizada
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display text-base font-semibold leading-6 text-ink">
                {member.name}
              </h3>
              <p className="text-small font-normal leading-5 text-ink-muted sm:text-label">
                {member.role}
              </p>
            </div>
          </article>
        ))}
      </div>
      {allPlaceholders && (
        <PendingNote>
          Perfiles, cargos y fotografías a completar con el material que
          entregue VDM.
        </PendingNote>
      )}
    </Section>
  );
}

function PendingNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 inline-flex items-center gap-2 rounded-sm border border-line bg-surface-alt px-3 py-1.5 text-small text-ink-muted">
      <span className="block size-2 shrink-0 rounded-full bg-blue" />
      {children}
    </p>
  );
}
