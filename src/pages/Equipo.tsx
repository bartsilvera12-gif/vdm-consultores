import { User } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { useTeam } from "@/hooks/useTeam";
import { cn } from "@/lib/utils";

/**
 * Formas de fondo detrás de cada retrato recortado, en coordenadas 0–1 del
 * propio recuadro (clipPath objectBoundingBox): un "8", un arco, un óvalo y
 * tres curvas apiladas. Se alternan con los azules de la marca y gris claro.
 */
const SHAPES = [
  "M0.2,0 H0.8 C0.91,0 1,0.09 1,0.2 V0.3 C1,0.38 0.94,0.44 0.9,0.5 C0.94,0.56 1,0.62 1,0.7 V0.8 C1,0.91 0.91,1 0.8,1 H0.2 C0.09,1 0,0.91 0,0.8 V0.7 C0,0.62 0.06,0.56 0.1,0.5 C0.06,0.44 0,0.38 0,0.3 V0.2 C0,0.09 0.09,0 0.2,0 Z",
  "M0,0.42 C0,0.19 0.22,0 0.5,0 C0.78,0 1,0.19 1,0.42 V1 H0 Z",
  "M0.5,0 C0.82,0 1,0.24 1,0.54 C1,0.82 0.8,1 0.5,1 C0.2,1 0,0.82 0,0.54 C0,0.24 0.18,0 0.5,0 Z",
  "M0.15,0 H0.85 C0.93,0 1,0.07 1,0.15 V0.2 C1,0.26 0.95,0.3 0.92,0.333 C0.95,0.36 1,0.41 1,0.47 V0.53 C1,0.59 0.95,0.64 0.92,0.667 C0.95,0.7 1,0.74 1,0.8 V0.85 C1,0.93 0.93,1 0.85,1 H0.15 C0.07,1 0,0.93 0,0.85 V0.8 C0,0.74 0.05,0.7 0.08,0.667 C0.05,0.64 0,0.59 0,0.53 V0.47 C0,0.41 0.05,0.36 0.08,0.333 C0.05,0.3 0,0.26 0,0.2 V0.15 C0,0.07 0.07,0 0.15,0 Z",
];
const COLORS = ["bg-blue-bright", "bg-navy", "bg-[#e8edf3]", "bg-sky"];

/** Define una vez los recortes de las formas para usarlos con clip-path. */
function ShapeDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        {SHAPES.map((d, i) => (
          <clipPath key={i} id={`equipo-forma-${i}`} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        ))}
      </defs>
    </svg>
  );
}

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
        <ShapeDefs />
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
          COLORS[index % COLORS.length],
          featured ? "aspect-[3/4]" : "aspect-[4/5]",
        )}
        style={{ clipPath: `url(#equipo-forma-${index % SHAPES.length})` }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            // Llena el ancho de la forma con aire arriba de la cabeza, como el
            // componente de referencia; lo que sobra abajo queda recortado.
            className="absolute inset-x-0 bottom-0 h-[90%] w-full object-cover object-top"
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
