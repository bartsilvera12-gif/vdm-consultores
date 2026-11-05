import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
import { useText } from "@/hooks/useSiteContent";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { TwoToneIcon } from "@/components/primitives/TwoToneIcon";
import { Button } from "@/components/ui/button";
import { useAreas } from "@/hooks/useAreas";
import { cn } from "@/lib/utils";

/** Qué área está en pantalla, para marcarla en el índice. */
function useActiveArea(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    if (ids.length === 0) return;
    setActive((cur) => (ids.includes(cur) ? cur : ids[0]));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

export function Servicios() {
  const { areas } = useAreas();
  const active = useActiveArea(areas.map((a) => a.id));

  return (
    <>
      <PageHero
        title={useText("servicios.hero_title")}
        lead={useText("servicios.hero_lead")}
      />

      {/* Índice fijo arriba: lleva a cada área y marca la que está en pantalla. */}
      <nav
        aria-label="Servicios"
        className="sticky top-[72px] z-30 border-y border-white/10 bg-navy"
      >
        <Container className="flex gap-6 overflow-x-auto [scrollbar-width:none] md:justify-center md:gap-10 [&::-webkit-scrollbar]:hidden">
          {areas.map((area) => (
            <a
              key={area.id}
              href={`#${area.id}`}
              className={cn(
                "relative shrink-0 py-4 font-display text-small font-semibold transition-colors duration-200",
                active === area.id ? "text-on-navy" : "text-on-navy-muted hover:text-on-navy",
              )}
            >
              {area.eyebrow}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 bottom-0 h-[2px] origin-center bg-sky transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  active === area.id ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          ))}
        </Container>
      </nav>

      {areas.map((area, i) => {
        // Intercalado: una franja azul tinta con texto blanco, una blanca.
        const dark = i % 2 === 0;
        return (
          <section
            key={area.id}
            id={area.id}
            className={cn("scroll-mt-32", dark ? "bg-ink text-on-navy" : "bg-surface text-ink")}
          >
            <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1fr_1fr] lg:gap-24">
              <Reveal className={cn("grid content-start gap-7", !dark && "lg:order-2")}>
                <TwoToneIcon
                  icon={area.icon}
                  tone={dark ? "onNavy" : "blue"}
                  className="size-14 md:size-16"
                />
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <span className={cn("h-px w-8", dark ? "bg-sky" : "bg-blue")} aria-hidden="true" />
                    <Eyebrow tone={dark ? "onNavy" : "default"}>{area.eyebrow}</Eyebrow>
                  </div>
                  <h2
                    className={cn(
                      "max-w-[18ch] text-[32px] leading-[38px] font-bold tracking-tight md:text-[46px] md:leading-[52px]",
                      dark ? "text-on-navy" : "text-ink",
                    )}
                  >
                    {area.title}
                  </h2>
                </div>
                <p
                  className={cn(
                    "max-w-[44ch] text-body md:text-lead",
                    dark ? "text-on-navy-muted" : "text-ink-muted",
                  )}
                >
                  {area.description}
                </p>
                <div className="pt-1">
                  <Button
                    asChild
                    variant={dark ? "onNavy" : "default"}
                    className={cn("group", dark && "text-ink")}
                  >
                    <Link to="/contacto" state={{ area: area.eyebrow }}>
                      Consultar sobre estos servicios
                      <ArrowRight
                        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </div>
              </Reveal>

              {/* Servicios: lista de líneas finas con un guion celeste. */}
              <ul
                className={cn(
                  "m-0 list-none self-center border-t p-0",
                  dark ? "border-white/15" : "border-ink/12",
                  !dark && "lg:order-1",
                )}
              >
                {area.services.map((svc, j) => (
                  <Reveal as="li" key={svc} delay={80 + j * 50}>
                    <span
                      className={cn(
                        "group flex items-center gap-4 border-b py-5 md:py-6",
                        dark ? "border-white/15" : "border-ink/12",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-4 flex-none bg-sky transition-[width] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-7"
                      />
                      <span
                        className={cn(
                          "font-display text-[17px] leading-[24px] font-medium md:text-[19px] md:leading-[26px]",
                          dark ? "text-on-navy" : "text-ink",
                        )}
                      >
                        {svc}
                      </span>
                    </span>
                  </Reveal>
                ))}
              </ul>
            </Container>
          </section>
        );
      })}

      <PageCta />
    </>
  );
}
