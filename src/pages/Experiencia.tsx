import { useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
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
import type { Sector } from "@/content/sectors";

const ease = "ease-[cubic-bezier(0.23,1,0.32,1)]";
const num = (i: number) => String(i + 1).padStart(2, "0");

/**
 * Experiencia como índice editorial: el título a todo el ancho, el índice de
 * sectores con numeración grande y una barra que se desliza hasta el elegido,
 * y el detalle en un bloque azul tinta que llega al borde de la pantalla con
 * el número del sector de fondo. Los seis detalles viven apilados en la misma
 * celda, así el cambio no hace saltar la altura. Flechas del teclado para
 * recorrer el índice.
 */
export function Experiencia() {
  const { sectors } = useSectors();
  const [index, setIndex] = useState(0);
  const active = Math.min(index, Math.max(sectors.length - 1, 0));

  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [bar, setBar] = useState({ top: 0, height: 0 });

  // La barra indicadora se ubica sobre la fila elegida (escritorio).
  useLayoutEffect(() => {
    const el = tabsRef.current[active];
    if (el) setBar({ top: el.offsetTop, height: el.offsetHeight });
  }, [active, sectors.length]);

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    let next = active;
    if (e.key in keys) next = (active + keys[e.key] + sectors.length) % sectors.length;
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

      <section className="overflow-hidden bg-surface pt-16 md:pt-24">
        <Container>
          {/* Encabezado: rótulo corto a la izquierda, título a lo ancho. */}
          <Reveal className="grid gap-6 border-b border-ink/10 pb-10 md:pb-14 lg:grid-cols-12 lg:gap-8">
            <div className="flex items-center gap-3 lg:col-span-3 lg:items-start lg:pt-5">
              <span className="h-px w-10 bg-ink" aria-hidden="true" />
              <Eyebrow tone="muted">Sectores que acompañamos</Eyebrow>
            </div>
            <h2 className="text-[40px] leading-[42px] font-bold tracking-[-0.03em] text-ink sm:text-[54px] sm:leading-[56px] lg:col-span-9 lg:text-[76px] lg:leading-[76px]">
              Cada cliente llega
              <br />
              <span className="text-blue">con un desafío distinto</span>
            </h2>
          </Reveal>
        </Container>

        {sectors.length > 0 && (
          <>
            {/* ESCRITORIO --------------------------------------------- */}
            <Container className="hidden lg:block">
              <div className="grid grid-cols-12 gap-8">
                {/* Índice */}
                <div
                  role="tablist"
                  aria-label="Sectores"
                  aria-orientation="vertical"
                  onKeyDown={onKey}
                  className="relative col-span-5 py-14"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 w-[3px] bg-sky transition-[transform,height] duration-500 ${ease} motion-reduce:transition-none`}
                    style={{ transform: `translateY(${bar.top}px)`, height: bar.height, top: 0 }}
                  />
                  {sectors.map((sector, i) => {
                    const selected = i === active;
                    return (
                      <button
                        key={sector.title}
                        ref={(el) => {
                          tabsRef.current[i] = el;
                        }}
                        id={`sector-tab-${i}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls="sector-panel"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setIndex(i)}
                        onMouseEnter={() => setIndex(i)}
                        className="group grid w-full grid-cols-[96px_1fr_32px] items-center border-b border-ink/10 py-5 pl-7 text-left outline-none first:border-t focus-visible:bg-surface-alt"
                      >
                        <span
                          className={cn(
                            `font-display text-[46px] leading-none font-semibold tracking-[-0.04em] tabular-nums transition-colors duration-300 ${ease}`,
                            selected ? "text-blue" : "text-ink/15 group-hover:text-ink/35",
                          )}
                        >
                          {num(i)}
                        </span>
                        <span
                          className={cn(
                            `font-display text-[19px] leading-[24px] font-semibold transition-[color,transform] duration-300 ${ease}`,
                            selected ? "translate-x-2 text-ink" : "text-ink-muted group-hover:translate-x-1 group-hover:text-ink",
                          )}
                        >
                          {sector.title}
                        </span>
                        <ArrowRight
                          aria-hidden="true"
                          className={cn(
                            `size-5 text-blue transition-[transform,opacity] duration-300 ${ease}`,
                            selected ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Detalle: bloque azul tinta hasta el borde derecho de la pantalla. */}
                <div
                  id="sector-panel"
                  role="tabpanel"
                  aria-labelledby={`sector-tab-${active}`}
                  className="relative col-span-7 mr-[calc(-1*(max(0px,(100vw-1180px)/2)+3rem))] bg-ink text-on-navy"
                >
                  <span aria-hidden="true" className="absolute left-0 top-0 h-full w-px bg-white/10" />
                  <div className="grid">
                    {sectors.map((sector, i) => (
                      <SectorDetail key={sector.title} sector={sector} i={i} shown={i === active} />
                    ))}
                  </div>
                </div>
              </div>
            </Container>

            {/* CELULAR Y TABLET ---------------------------------------- */}
            <div className="lg:hidden">
              <div
                role="tablist"
                aria-label="Sectores"
                onKeyDown={onKey}
                className="flex snap-x gap-0 overflow-x-auto px-4 pt-8 [scrollbar-width:none] md:px-12 [&::-webkit-scrollbar]:hidden"
              >
                {sectors.map((sector, i) => {
                  const selected = i === active;
                  return (
                    <button
                      key={sector.title}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="sector-panel-m"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setIndex(i)}
                      className="relative grid w-[148px] flex-none snap-start content-start gap-2 border-l border-ink/10 px-4 pb-5 text-left outline-none first:border-l-0 first:pl-0 focus-visible:bg-surface-alt"
                    >
                      <span
                        className={cn(
                          `font-display text-[40px] leading-none font-semibold tracking-[-0.04em] tabular-nums transition-colors duration-300 ${ease}`,
                          selected ? "text-blue" : "text-ink/15",
                        )}
                      >
                        {num(i)}
                      </span>
                      <span
                        className={cn(
                          "font-display text-[13px] leading-[17px] font-semibold transition-colors duration-300",
                          selected ? "text-ink" : "text-ink-muted",
                        )}
                      >
                        {sector.title}
                      </span>
                      <span
                        aria-hidden="true"
                        className={cn(
                          `absolute bottom-0 left-4 right-4 h-[3px] origin-left bg-sky transition-transform duration-500 ${ease}`,
                          i === 0 && "left-0",
                          selected ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              <div id="sector-panel-m" role="tabpanel" className="grid bg-ink text-on-navy">
                {sectors.map((sector, i) => (
                  <SectorDetail key={sector.title} sector={sector} i={i} shown={i === active} compact />
                ))}
              </div>
            </div>
          </>
        )}

        <Container>
          <p className="flex items-center gap-3 py-10 text-small text-ink-muted">
            <span className="h-px w-6 flex-none bg-sky" aria-hidden="true" />
            Espacio para casos y proyectos: se publican solo con autorización
            del cliente.
          </p>
        </Container>
      </section>

      <PageCta />
    </>
  );
}

/**
 * Un sector en el bloque azul. Todos ocupan la misma celda de la grilla; solo
 * el elegido se ve. Al cambiar, el número de fondo entra desde la derecha y el
 * ícono, el título, el texto y el enlace suben en escalonado.
 */
function SectorDetail({
  sector,
  i,
  shown,
  compact = false,
}: {
  sector: Sector;
  i: number;
  shown: boolean;
  compact?: boolean;
}) {
  const step = (delay: string) =>
    cn(
      `transition-[opacity,transform] duration-500 ${ease} motion-reduce:transition-none`,
      shown ? `translate-y-0 opacity-100 ${delay}` : "translate-y-3 opacity-0 delay-0",
    );
  return (
    <div
      aria-hidden={!shown}
      className={cn(
        "relative col-start-1 row-start-1 overflow-hidden",
        compact ? "min-h-[400px] px-4 py-12 md:px-12" : "min-h-[520px] py-16 pl-16 pr-[calc(max(0px,(100vw-1180px)/2)+6rem)]",
        !shown && "pointer-events-none",
      )}
    >
      {/* Número sobredimensionado de fondo. */}
      <span
        aria-hidden="true"
        className={cn(
          `pointer-events-none absolute select-none font-display font-semibold leading-none tracking-[-0.06em] text-white/[0.06] transition-[opacity,transform] duration-700 ${ease} motion-reduce:transition-none`,
          compact ? "-bottom-6 right-2 text-[200px]" : "-bottom-14 right-[calc(max(0px,(100vw-1180px)/2)+3rem)] text-[300px]",
          shown ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0",
        )}
      >
        {num(i)}
      </span>

      <div className="relative grid max-w-[560px] content-start gap-8">
        {/* Ícono en un marco geométrico con una esquina celeste. */}
        <div className={cn("relative grid size-[84px] place-items-center border border-white/20", step("delay-75"))}>
          <span aria-hidden="true" className="absolute -left-px -top-px size-3 border-l-2 border-t-2 border-sky" />
          <TwoToneIcon icon={sector.icon} tone="onNavy" className="size-10" strokeWidth={1.25} />
        </div>
        <div className="grid gap-5">
          <h3
            className={cn(
              "font-heading font-bold tracking-[-0.02em] text-on-navy",
              compact ? "text-[30px] leading-[34px]" : "text-[44px] leading-[48px]",
              step("delay-150"),
            )}
          >
            {sector.title}
          </h3>
          <p
            className={cn(
              "max-w-[46ch] text-on-navy-muted",
              compact ? "text-body" : "text-lead leading-[32px]",
              step("delay-200"),
            )}
          >
            {sector.body}
          </p>
        </div>
        <div className={step("delay-300")}>
          <Link
            to="/contacto"
            tabIndex={shown ? undefined : -1}
            className="group inline-flex items-center gap-4 font-display text-base font-semibold text-on-navy"
          >
            <span className="relative">
              Agenda tu consulta
              <span
                aria-hidden="true"
                className={`absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-sky transition-transform duration-300 ${ease} group-hover:scale-x-100`}
              />
            </span>
            <span className="grid size-10 place-items-center border border-white/25 transition-colors duration-300 group-hover:border-sky group-hover:bg-sky">
              <ArrowRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
