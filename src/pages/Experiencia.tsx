import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { TwoToneIcon } from "@/components/primitives/TwoToneIcon";
import { useSectors } from "@/hooks/useSectors";
import { cn } from "@/lib/utils";

export function Experiencia() {
  const { sectors } = useSectors();
  const [index, setIndex] = useState(0);
  const current = sectors[Math.min(index, sectors.length - 1)];

  return (
    <>
      <PageHero
        eyebrow="Experiencia"
        title="A quiénes acompañamos"
        lead="Empresas en cada etapa e inversionistas que llegan a Paraguay."
      />

      <section className="bg-surface py-14 md:py-24">
        <Container>
          <Reveal className="mb-10 grid gap-3 md:mb-14">
            <Eyebrow>Sectores que acompañamos</Eyebrow>
            <h2 className="max-w-[24ch] font-display text-[28px] leading-[34px] font-semibold tracking-tight text-ink md:text-[40px] md:leading-[46px]">
              Cada cliente llega con un desafío distinto
            </h2>
          </Reveal>

          {/* Escritorio: lista a la izquierda, detalle del sector elegido a la derecha. */}
          {current && (
            <div className="hidden gap-8 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
              <ul role="tablist" aria-label="Sectores" className="m-0 grid list-none content-start gap-1 p-0">
                {sectors.map((sector, i) => {
                  const selected = i === index;
                  return (
                    <li key={sector.title}>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setIndex(i)}
                        onMouseEnter={() => setIndex(i)}
                        className={cn(
                          "group grid w-full grid-cols-[44px_1fr_20px] items-center gap-4 rounded-lg px-5 py-4 text-left transition-[background-color,color] duration-200",
                          selected ? "bg-blue text-on-blue" : "text-ink hover:bg-surface-alt",
                        )}
                      >
                        <span
                          className={cn(
                            "font-display text-small font-semibold tabular-nums",
                            selected ? "text-on-navy-muted" : "text-ink-muted",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="font-display text-lg font-medium leading-6">
                          {sector.title}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className={cn(
                            "size-4 transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]",
                            selected ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0",
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div
                role="tabpanel"
                className="relative min-h-[420px] overflow-hidden rounded-xl bg-navy p-10 text-on-navy"
              >
                {/* key fuerza la entrada animada al cambiar de sector. */}
                <div
                  key={current.title}
                  className="relative grid gap-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-300"
                >
                  <TwoToneIcon icon={current.icon} tone="onNavy" className="size-20" />
                  <h3 className="font-heading text-[32px] leading-[38px] font-semibold">
                    {current.title}
                  </h3>
                  <p className="max-w-[46ch] text-lead text-on-navy-muted">{current.body}</p>
                  <Link
                    to="/contacto"
                    className="group inline-flex items-center gap-2 justify-self-start font-display font-semibold text-on-navy"
                  >
                    Hablemos de tu caso
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Celular y tablet: tarjetas que aparecen al hacer scroll. */}
          <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:hidden">
            {sectors.map((sector, i) => (
              <Reveal as="li" key={sector.title} delay={(i % 2) * 80}>
                <article className="relative h-full overflow-hidden rounded-xl bg-navy p-6 text-on-navy">
                  <span
                    aria-hidden="true"
                    className="absolute right-5 top-4 font-display text-[44px] font-bold leading-none text-white/10"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <TwoToneIcon icon={sector.icon} tone="onNavy" className="mb-5 size-14" />
                  <h3 className="mb-2 font-heading text-[22px] leading-[28px] font-semibold">
                    {sector.title}
                  </h3>
                  <p className="text-small leading-[23px] text-on-navy-muted">{sector.body}</p>
                </article>
              </Reveal>
            ))}
          </ul>

          <p className="mt-10 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-small text-ink-muted">
            <span className="block size-2 shrink-0 rounded-full bg-blue" />
            Espacio para casos y proyectos: se publican solo con autorización
            del cliente.
          </p>
        </Container>
      </section>

      <PageCta
        title="¿Tu caso encaja con alguno?"
        body="Escríbenos y te decimos qué pasos siguen para tu empresa o inversión."
      />
    </>
  );
}
