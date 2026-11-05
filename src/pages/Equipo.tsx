import { User } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { useTeam } from "@/hooks/useTeam";
import { cn } from "@/lib/utils";

/**
 * Formas de fondo detrás de cada retrato, armadas como en el componente de
 * referencia: rectángulos muy redondeados que se superponen (la curva suave
 * sale sola donde se tocan) y elipses. Coordenadas 0–1 del recuadro
 * (objectBoundingBox); `k` = alto / ancho, para que las esquinas sean redondas.
 */
const SHAPES: Array<(k: number) => JSX.Element[]> = [
  // Tres curvas apiladas.
  (k) =>
    [0, 0.31, 0.62].map((y) => (
      <rect key={y} x="0" y={y} width="1" height="0.38" rx="0.34" ry={0.34 / k} />
    )),
  // Arco: medio círculo arriba, recto abajo.
  (k) => [
    <ellipse key="e" cx="0.5" cy={0.5 / k} rx="0.5" ry={0.5 / k} />,
    <rect key="r" x="0" y={0.5 / k} width="1" height={1 - 0.5 / k} />,
  ],
  // Óvalo, apenas cortado abajo.
  () => [<ellipse key="e" cx="0.5" cy="0.55" rx="0.5" ry="0.55" />],
  // "8": dos rectángulos redondeados superpuestos.
  (k) =>
    [0, 0.44].map((y) => (
      <rect key={y} x="0" y={y} width="1" height="0.56" rx="0.3" ry={0.3 / k} />
    )),
];
/** Orden en pantalla de las tres principales: la primera (directora) al medio. */
const LEAD_ORDER = ["sm:order-2", "sm:order-1", "sm:order-3"];
const COLORS = ["bg-sky", "bg-blue-bright", "bg-[#e8edf3]", "bg-navy"];

/** Alto / ancho de cada tipo de tarjeta (debe coincidir con su aspect-*). */
const RATIOS = { tall: 16 / 9, card: 5 / 4 };

/** Define una vez los recortes de las formas para usarlos con clip-path. */
function ShapeDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        {Object.entries(RATIOS).flatMap(([kind, k]) =>
          SHAPES.map((shape, i) => (
            <clipPath key={`${kind}-${i}`} id={`equipo-${kind}-${i}`} clipPathUnits="objectBoundingBox">
              {shape(k)}
            </clipPath>
          )),
        )}
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
          <div className="mx-auto grid w-full max-w-[880px] grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
            {lead.map((member, i) => (
              <MemberCard
                key={member.id ?? i}
                member={member}
                index={i}
                featured
                // La directora va al medio (en celular, primera), con su forma.
                className={LEAD_ORDER[i]}
              />
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
  className,
}: {
  member: Member;
  index: number;
  featured?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      as="article"
      delay={(index % (featured ? 3 : 5)) * 90}
      className={cn("grid content-start justify-items-center gap-5 text-center", className)}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          COLORS[index % COLORS.length],
          featured ? "aspect-[9/16]" : "aspect-[4/5]",
        )}
        style={{ clipPath: `url(#equipo-${featured ? "tall" : "card"}-${index % SHAPES.length})` }}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            // La foto entera, sin recortar: apoyada abajo y con aire arriba.
            // Las tres principales van de cuerpo entero, en una forma alta.
            className={cn(
              "absolute inset-x-0 bottom-0 w-full object-contain object-bottom",
              featured ? "h-[95%]" : "h-[90%]",
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
