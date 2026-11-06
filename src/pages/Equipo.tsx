import { User } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { PageHero } from "@/components/primitives/PageHero";
import { useText } from "@/hooks/useSiteContent";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { useTeam } from "@/hooks/useTeam";
import { useLang, useT, useTr } from "@/i18n/context";
import { translateName } from "@/i18n/content";
import { cn } from "@/lib/utils";

/** Orden en pantalla de las tres principales: la primera (directora) al medio. */
const LEAD_ORDER = ["sm:order-2", "sm:order-1", "sm:order-3"];
/** Fondo de todos los retratos: el gris claro que pidió la clienta. */
const PHOTO_BG = "bg-[#e8edf3]";

type Member = { id?: string; name: string; role: string; photo?: string };

export function Equipo() {
  const { members } = useTeam();
  const t = useT();
  const allPlaceholders =
    members.length > 0 && members.every((m) => m.name === "Nombre y apellido");
  // Jerarquía del boceto: primero las tres que están día a día (cuerpo
  // entero), después el resto en el orden que cargó la clienta.
  const lead = members.slice(0, 3);
  const rest = members.slice(3);

  return (
    <>
      <PageHero
        eyebrow={t.team.eyebrow}
        title={useText("equipo.hero_title")}
        lead={useText("equipo.hero_lead")}
      />
      <section className="bg-surface py-16 md:py-24">
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
              {t.team.placeholderNote}
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
  const lang = useLang();
  const tr = useTr();
  const name = translateName(member.name, lang);
  return (
    <Reveal
      as="article"
      delay={(index % (featured ? 3 : 5)) * 90}
      className={cn("grid content-start justify-items-center gap-5 text-center", className)}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          PHOTO_BG,
          featured ? "aspect-[9/16]" : "aspect-[4/5]",
        )}
      >
        {member.photo ? (
          <img
            src={member.photo}
            alt={name}
            loading="lazy"
            // La foto entera, sin recortar: apoyada abajo y con aire arriba.
            // Las tres principales van de cuerpo entero, en una forma alta.
            className={cn(
              featured
                ? "absolute inset-x-0 bottom-0 h-[95%] w-full object-contain object-bottom"
                : // Bustos: todos a la misma altura; si la foto es apaisada
                  // (Javier, María Beatriz) se recortan los costados de los
                  // hombros para que no quede chiquita.
                  "absolute bottom-0 left-1/2 h-[84%] w-auto max-w-none -translate-x-1/2",
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
          {name}
        </h2>
        <p
          className={cn(
            "mx-auto max-w-[28ch] text-ink-muted",
            featured ? "text-small" : "text-[13px] leading-[18px]",
          )}
        >
          {tr(member.role)}
        </p>
      </div>
    </Reveal>
  );
}
