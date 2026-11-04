import { User } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { useTeam } from "@/hooks/useTeam";
import { cn } from "@/lib/utils";

/**
 * Formas y colores de fondo que se van alternando detrás de cada retrato
 * recortado (azules de la marca y gris claro; sin naranja).
 */
const SHAPES = [
  "rounded-t-[999px] rounded-b-[28px]",
  "rounded-[36%]",
  "rounded-[999px]",
  "rounded-[28px] rounded-tr-[999px]",
];
const COLORS = ["bg-navy", "bg-blue-bright", "bg-[#e8edf3]", "bg-sky"];

type Member = { id?: string; name: string; role: string; photo?: string };

export function Equipo() {
  const { members } = useTeam();
  const allPlaceholders =
    members.length > 0 && members.every((m) => m.name === "Nombre y apellido");
  // Jerarquía del boceto: primero las tres que están día a día (cuerpo
  // entero), después el resto en el orden que cargó la clienta.
  const lead = members.slice(0, 3);
  const rest = members.slice(3);

  return (
    <>
      <PageHero
        eyebrow="Equipo profesional"
        title="Profesionales especializados en cada área"
        lead="Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente."
      />
      <section className="bg-surface py-16 md:py-24">
        <Container className="grid gap-16 md:gap-24">
          <div className="mx-auto grid w-full max-w-[980px] grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {lead.map((member, i) => (
              <MemberCard key={member.id ?? i} member={member} index={i} featured />
            ))}
          </div>

          {rest.length > 0 && (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-6">
              {rest.map((member, i) => (
                <MemberCard key={member.id ?? i} member={member} index={i + 3} />
              ))}
            </div>
          )}

          {allPlaceholders && (
            <p className="inline-flex items-center gap-2 justify-self-center rounded-full border border-line bg-surface px-4 py-2 text-small text-ink-muted">
              <span className="block size-2 shrink-0 rounded-full bg-blue" />
              Perfiles, cargos y fotografías a completar con el material que
              entregue VDM.
            </p>
          )}
        </Container>
      </section>
      <PageCta />
    </>
  );
}

function MemberCard({
  member,
  index,
  featured = false,
}: {
  member: Member;
  index: number;
  featured?: boolean;
}) {
  return (
    <Reveal
      as="article"
      delay={(index % (featured ? 3 : 5)) * 90}
      className="grid content-start justify-items-center gap-5 text-center"
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          SHAPES[index % SHAPES.length],
          COLORS[index % COLORS.length],
          featured ? "aspect-[3/4]" : "aspect-square",
        )}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className={cn(
              "absolute inset-x-0 bottom-0 mx-auto w-auto max-w-full object-contain object-bottom",
              featured ? "h-[94%]" : "h-[90%]",
            )}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-on-navy">
            <User className="size-10" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="grid gap-1.5">
        <h2
          className={cn(
            "font-semibold text-ink",
            featured ? "text-[22px] leading-[28px]" : "text-[17px] leading-[22px]",
          )}
        >
          {member.name}
        </h2>
        <p
          className={cn(
            "mx-auto max-w-[28ch] text-ink-muted",
            featured ? "text-small" : "text-[13px] leading-[18px]",
          )}
        >
          {member.role}
        </p>
      </div>
    </Reveal>
  );
}
