import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { useSectors } from "@/hooks/useSectors";
import { cn } from "@/lib/utils";
// Palacio de López, Asunción. Foto de André Piske en Unsplash (licencia libre).
import fotoPalacio from "@/assets/sectores/palacio.webp";
// Una foto por sector (Unsplash, licencia libre), se muestra al pasar el mouse.
import fotoFormacion from "@/assets/sectores/exp-formacion.webp";
import fotoConsolidadas from "@/assets/sectores/exp-consolidadas.webp";
import fotoInversionistas from "@/assets/sectores/exp-inversionistas.webp";
import fotoIndustria from "@/assets/sectores/exp-industria.webp";
import fotoComercio from "@/assets/sectores/exp-comercio.webp";
import fotoInmobiliaria from "@/assets/sectores/exp-inmobiliaria.webp";

/** Foto de cada sector por título; si se cambia el nombre en el panel, por orden. */
const SECTOR_PHOTOS: Record<string, string> = {
  "Empresas en formación": fotoFormacion,
  "Empresas consolidadas": fotoConsolidadas,
  "Inversionistas extranjeros": fotoInversionistas,
  "Industria y maquila": fotoIndustria,
  "Comercio exterior": fotoComercio,
  "Inversión inmobiliaria": fotoInmobiliaria,
};
const PHOTO_ORDER = Object.values(SECTOR_PHOTOS);

type Sector = ReturnType<typeof useSectors>["sectors"][number];

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";
/** Fila de cada sector en escritorio (clases enteras para Tailwind). */
const ROWS = ["md:row-start-1", "md:row-start-2", "md:row-start-3", "md:row-start-4"];

/**
 * Experiencia: los sectores a los dos lados de una foto de Asunción, en
 * espejo, cada uno unido a la foto por una línea fina que se dibuja al
 * aparecer y se enciende al pasar el mouse. La foto se desplaza apenas al
 * deslizar. En celular la foto va arriba y los sectores debajo, sin líneas.
 */
export function Experiencia() {
  const { sectors } = useSectors();
  const half = Math.ceil(sectors.length / 2);
  const left = sectors.slice(0, half);
  const right = sectors.slice(half);
  // Sector bajo el mouse (o con foco): cambia la foto del medio.
  const [active, setActive] = useState<number | null>(null);
  const photos = sectors.map((s, i) => SECTOR_PHOTOS[s.title] ?? PHOTO_ORDER[i % PHOTO_ORDER.length]);

  return (
    <>
      <PageHero
        eyebrow="Experiencia"
        title="A quiénes acompañamos"
        lead="Empresas en cada etapa e inversionistas que llegan a Paraguay."
      />

      <section className="overflow-hidden bg-surface-alt py-16 md:py-24">
        <Container>
          <Reveal className="mb-12 grid justify-items-center gap-4 text-center md:mb-16">
            <Eyebrow>Sectores que acompañamos</Eyebrow>
            <h2 className="max-w-[22ch] text-[32px] leading-[38px] font-bold tracking-tight text-ink md:text-[44px] md:leading-[50px]">
              Cada cliente llega con un desafío distinto
            </h2>
            <span className="h-[3px] w-16 bg-sky" aria-hidden="true" />
          </Reveal>

          <div
            onMouseLeave={() => setActive(null)}
            className="grid gap-10 md:grid-cols-[1fr_minmax(260px,360px)_1fr] md:gap-x-10 md:gap-y-12 lg:gap-x-14">
            <Photo
              photos={photos}
              active={active}
              className={cn("md:col-start-2 md:row-start-1 md:self-center", rowSpan(half))}
            />
            {left.map((sector, i) => (
              <SectorItem
                key={sector.title}
                sector={sector}
                side="left"
                row={i}
                selected={active === i}
                onSelect={(on) => setActive(on ? i : null)}
              />
            ))}
            {right.map((sector, i) => (
              <SectorItem
                key={sector.title}
                sector={sector}
                side="right"
                row={i}
                selected={active === i + half}
                onSelect={(on) => setActive(on ? i + half : null)}
              />
            ))}
          </div>

          <p className="mt-14 text-center text-small text-ink-muted">
            Espacio para casos y proyectos: se publican solo con autorización
            del cliente.
          </p>
        </Container>
      </section>

      <PageCta />
    </>
  );
}

function rowSpan(n: number) {
  return ["md:row-span-1", "md:row-span-2", "md:row-span-3", "md:row-span-4"][Math.max(0, Math.min(n, 4) - 1)];
}

/**
 * Foto central: el Palacio de López y, encima, la foto de cada sector, que
 * aparece con un fundido cuando se elige ese sector. Se mueve unos píxeles
 * al deslizar, contraria al scroll.
 */
function Photo({ photos, active, className }: { photos: string[]; active: number | null; className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const layer = layerRef.current;
    if (!frame || !layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = frame.getBoundingClientRect();
      // -1 cuando entra por abajo, 1 cuando sale por arriba.
      const p = (window.innerHeight / 2 - (r.top + r.height / 2)) / (window.innerHeight / 2 + r.height / 2);
      const clamped = Math.max(-1, Math.min(1, p));
      layer.style.transform = `translate3d(0, ${(clamped * 5).toFixed(2)}%, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Reveal delay={100} className={cn("mx-auto w-full max-w-[360px]", className)}>
      <figure ref={frameRef} className="group relative m-0 aspect-[3/4] overflow-hidden rounded-md bg-ink">
        <div ref={layerRef} className="absolute -inset-y-[6%] inset-x-0 will-change-transform">
          <img
            src={fotoPalacio}
            alt="Palacio de López, en Asunción"
            width={900}
            height={1200}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 ${ease} group-hover:scale-[1.04] motion-reduce:transition-none`}
          />
          {photos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              aria-hidden="true"
              width={900}
              height={1200}
              loading="lazy"
              className={cn(
                `absolute inset-0 h-full w-full object-cover transition-[opacity,scale] duration-700 ${ease} motion-reduce:transition-none`,
                active === i ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
              )}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-end justify-center bg-[linear-gradient(to_top,rgba(10,39,71,0.6),transparent_45%)] p-5">
          <Link
            to="/contacto"
            className="group/cta inline-flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 font-display text-small font-semibold text-ink transition-colors hover:bg-white"
          >
            Agenda tu consulta
            <ArrowRight
              className="size-4 transition-transform duration-200 group-hover/cta:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </figure>
    </Reveal>
  );
}

function SectorItem({
  sector,
  side,
  row,
  selected,
  onSelect,
}: {
  sector: Sector;
  side: "left" | "right";
  row: number;
  selected: boolean;
  onSelect: (on: boolean) => void;
}) {
  const Icon = sector.icon;
  const isLeft = side === "left";
  return (
    <Reveal
      delay={150 + row * 120 + (isLeft ? 0 : 60)}
      className={cn(
        "group/rev md:self-start",
        ROWS[row],
        isLeft ? "md:col-start-1" : "md:col-start-3",
      )}
    >
      <article
        tabIndex={0}
        aria-current={selected || undefined}
        onMouseEnter={() => onSelect(true)}
        onFocus={() => onSelect(true)}
        onBlur={() => onSelect(false)}
        className="group grid gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-4 focus-visible:ring-offset-surface-alt"
      >
        <div className={cn("flex items-center gap-3", !isLeft && "md:flex-row-reverse")}>
          <span className="grid size-12 flex-none place-items-center rounded-md bg-blue/10 text-blue transition-colors duration-300 group-hover:bg-blue group-hover:text-on-navy">
            <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h3
            className={cn(
              "text-[19px] leading-[25px] font-semibold text-ink transition-colors duration-300 group-hover:text-blue",
              !isLeft && "md:text-right",
            )}
          >
            {sector.title}
          </h3>
          {/* Línea hasta el borde de la foto, con un punto al final. */}
          <span
            aria-hidden="true"
            className={cn(
              "relative hidden h-px min-w-6 flex-1 md:block",
              isLeft ? "md:-mr-10 lg:-mr-14" : "md:-ml-10 lg:-ml-14",
            )}
          >
            <span
              className={cn(
                `absolute inset-0 scale-x-0 transition-transform delay-500 duration-700 ${ease} group-data-[shown=true]/rev:scale-x-100 motion-reduce:transition-none`,
                isLeft ? "origin-left" : "origin-right",
              )}
            >
              <span className="block h-full w-full bg-ink/20 transition-colors duration-300 group-hover:bg-sky" />
            </span>
            <span
              className={cn(
                "absolute top-1/2 -translate-y-1/2 opacity-0 transition-opacity delay-1000 duration-300 group-data-[shown=true]/rev:opacity-100 motion-reduce:transition-none",
                isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
              )}
            >
              <span className="block size-1.5 rounded-full bg-ink/30 transition-[background-color,scale] duration-300 group-hover:scale-150 group-hover:bg-sky" />
            </span>
          </span>
        </div>
        <p
          className={cn(
            "pl-[60px] text-small leading-[23px] text-ink-muted",
            !isLeft && "md:pl-0 md:pr-[60px] md:text-right",
          )}
        >
          {sector.body}
        </p>
      </article>
    </Reveal>
  );
}
