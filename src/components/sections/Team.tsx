import { User } from "lucide-react";
import { Section, SectionHead } from "@/components/primitives/Section";
import { team } from "@/content/team";

export function Team() {
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
        {team.map((member, i) => (
          <article key={i} className="grid gap-3">
            <div className="grid aspect-[4/5] max-w-full place-items-center rounded-lg border border-dashed border-line-strong bg-surface-alt p-3 text-center text-small text-ink-muted sm:p-4">
              <div>
                <User
                  className="mx-auto mb-2 block size-9 text-line-strong sm:size-11"
                  aria-hidden="true"
                />
                Fotografía autorizada
              </div>
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
      <PendingNote>
        Perfiles, cargos y fotografías a completar con el material que entregue
        VDM.
      </PendingNote>
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
