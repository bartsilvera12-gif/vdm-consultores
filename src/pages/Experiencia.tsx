import { useRef, useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { useSectors } from "@/hooks/useSectors";
import { cn } from "@/lib/utils";

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";

/**
 * Experiencia como índice tipográfico: los seis sectores son titulares que
 * ocupan el ancho; el elegido pasa a tinta plena y su detalle se abre debajo,
 * corrido hacia la derecha de la grilla. Un solo acento: la raya azul sobre el
 * sector activo. Se elige con clic o con las flechas del teclado.
 */
export function Experiencia() {
  const { sectors } = useSectors();
  const [index, setIndex] = useState(0);
  const active = Math.min(index, Math.max(sectors.length - 1, 0));
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const step: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };
    let next = active;
    if (e.key in step) next = (active + step[e.key] + sectors.length) % sectors.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = sectors.length - 1;
    else return;
    e.preventDefault();
    setIndex(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <>
      <PageHero
        eyebrow="Experiencia"
        title="A quiénes acompañamos"
        lead="Empresas en cada etapa e inversionistas que llegan a Paraguay."
      />

      <section className="bg-surface pt-16 pb-6 md:pt-28 md:pb-10">
        <Container>
          <Reveal className="grid gap-5 pb-12 md:pb-20 lg:grid-cols-12 lg:gap-8">
            <Eyebrow tone="muted" className="lg:col-span-3 lg:pt-4">
              Sectores que acompañamos
            </Eyebrow>
            <h2 className="text-[38px] leading-[42px] font-bold tracking-[-0.03em] text-ink sm:text-[52px] sm:leading-[56px] lg:col-span-9 lg:text-[68px] lg:leading-[72px]">
              Cada cliente llega
              <br />
              con un desafío distinto
            </h2>
          </Reveal>

          <div role="tablist" aria-label="Sectores" aria-orientation="vertical" onKeyDown={onKey}>
            {sectors.map((sector, i) => {
              const selected = i === active;
              const Icon = sector.icon;
              return (
                <div key={sector.title} className="relative border-t border-ink/12 last:border-b">
                  {/* Único acento: la raya azul sobre el sector elegido. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      `absolute -top-px left-0 h-[2px] w-full origin-left bg-blue transition-transform duration-700 ${ease} motion-reduce:transition-none`,
                      selected ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                  <button
                    ref={(el) => {
                      tabsRef.current[i] = el;
                    }}
                    id={`sector-tab-${i}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`sector-panel-${i}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setIndex(i)}
                    className="group grid w-full grid-cols-[32px_1fr] items-baseline gap-x-4 py-6 text-left outline-none focus-visible:bg-surface-alt md:py-8 lg:grid-cols-12 lg:gap-x-8"
                  >
                    <span
                      className={cn(
                        "font-display text-[12px] font-semibold tabular-nums tracking-[0.08em] transition-colors duration-300 lg:col-span-1",
                        selected ? "text-ink" : "text-ink/35",
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        `font-heading text-[28px] leading-[32px] font-bold tracking-[-0.02em] transition-colors duration-500 ${ease} sm:text-[38px] sm:leading-[42px] lg:col-span-11 lg:text-[52px] lg:leading-[56px]`,
                        selected ? "text-ink" : "text-ink/20 group-hover:text-ink/45",
                      )}
                    >
                      {sector.title}
                    </span>
                  </button>

                  {/* Detalle: se abre debajo del titular, corrido a la derecha. */}
                  <div
                    id={`sector-panel-${i}`}
                    role="tabpanel"
                    aria-labelledby={`sector-tab-${i}`}
                    aria-hidden={!selected}
                    className={cn(
                      `grid transition-[grid-template-rows] duration-700 ${ease} motion-reduce:transition-none`,
                      selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={cn(
                          `grid grid-cols-[32px_1fr] gap-x-4 pb-10 transition-[opacity,transform] duration-500 ${ease} motion-reduce:transition-none md:pb-14 lg:grid-cols-12 lg:gap-x-8`,
                          selected ? "translate-y-0 opacity-100 delay-150" : "-translate-y-2 opacity-0",
                        )}
                      >
                        <Icon
                          aria-hidden="true"
                          strokeWidth={1.25}
                          className="col-start-1 mt-1 size-6 text-ink/50 lg:col-start-6 lg:mt-1.5 lg:size-7"
                        />
                        <div className="col-start-2 grid gap-8 lg:col-span-6 lg:col-start-7">
                          <p className="max-w-[40ch] text-[17px] leading-[30px] text-ink-muted md:text-[20px] md:leading-[34px]">
                            {sector.body}
                          </p>
                          <Link
                            to="/contacto"
                            tabIndex={selected ? undefined : -1}
                            className="group/cta inline-flex items-center gap-3 justify-self-start font-display text-base font-semibold text-ink"
                          >
                            <span className="relative pb-1">
                              Agenda tu consulta
                              <span
                                aria-hidden="true"
                                className={`absolute bottom-0 left-0 h-px w-full origin-left bg-ink transition-transform duration-500 ${ease} group-hover/cta:scale-x-0`}
                              />
                            </span>
                            <ArrowRight
                              aria-hidden="true"
                              className={`size-4 transition-transform duration-500 ${ease} group-hover/cta:translate-x-1.5`}
                            />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="pt-10 text-small text-ink-muted lg:grid lg:grid-cols-12 lg:gap-8">
            <span className="lg:col-span-9 lg:col-start-4">
              Espacio para casos y proyectos: se publican solo con autorización
              del cliente.
            </span>
          </p>
        </Container>
      </section>

      <PageCta />
    </>
  );
}
