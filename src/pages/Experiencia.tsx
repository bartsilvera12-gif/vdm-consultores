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

type Sector = ReturnType<typeof useSectors>["sectors"][number];

/**
 * Experiencia: los sectores en dos columnas, a los lados de una foto de
 * Asunción. En celular la foto va arriba y los sectores debajo.
 */
export function Experiencia() {
  const { sectors } = useSectors();
  const half = Math.ceil(sectors.length / 2);
  const left = sectors.slice(0, half);
  const right = sectors.slice(half);

  return (
    <>
      <PageHero
        eyebrow="Experiencia"
        title="A quiénes acompañamos"
        lead="Empresas en cada etapa e inversionistas que llegan a Paraguay."
      />

      <section className="bg-surface-alt py-16 md:py-24">
        <Container>
          <Reveal className="mb-12 grid justify-items-center gap-4 text-center md:mb-16">
            <Eyebrow>Sectores que acompañamos</Eyebrow>
            <h2 className="max-w-[22ch] text-[32px] leading-[38px] font-bold tracking-tight text-ink md:text-[44px] md:leading-[50px]">
              Cada cliente llega con un desafío distinto
            </h2>
            <span className="h-[3px] w-16 bg-sky" aria-hidden="true" />
          </Reveal>

          <div className="grid items-center gap-12 md:grid-cols-[1fr_minmax(260px,340px)_1fr] md:gap-10 lg:gap-14">
            <SectorColumn sectors={left} from="left" />

            <Reveal delay={100} className="order-first mx-auto w-full max-w-[340px] md:order-none">
              <figure className="group relative m-0 overflow-hidden rounded-md">
                <img
                  src={fotoPalacio}
                  alt="Palacio de López, en Asunción"
                  width={900}
                  height={1200}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                />
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

            <SectorColumn sectors={right} from="right" />
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

function SectorColumn({ sectors, from }: { sectors: Sector[]; from: "left" | "right" }) {
  return (
    <div className="grid gap-10 md:gap-14">
      {sectors.map((sector, i) => {
        const Icon = sector.icon;
        return (
          <Reveal key={sector.title} delay={150 + i * 120}>
            <article
              className={cn(
                "group grid gap-3 transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none",
                from === "right" && "md:pl-2",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-12 flex-none place-items-center rounded-md bg-blue/10 text-blue transition-colors duration-300 group-hover:bg-blue group-hover:text-on-navy">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="text-[19px] leading-[25px] font-semibold text-ink transition-colors duration-300 group-hover:text-blue">
                  {sector.title}
                </h3>
              </div>
              <p className="pl-[60px] text-small leading-[23px] text-ink-muted">{sector.body}</p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
