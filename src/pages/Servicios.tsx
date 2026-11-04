import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
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
        title="Nuestros servicios"
        lead="Desde la constitución de tu empresa hasta la concreción de tu inversión, cada área trabaja coordinada con las demás."
      />

      {/* Índice fijo arriba: lleva a cada área y marca la que está en pantalla. */}
      <nav
        aria-label="Servicios"
        className="sticky top-[72px] z-30 border-b border-line bg-surface/95 backdrop-blur"
      >
        <Container className="flex gap-6 overflow-x-auto [scrollbar-width:none] md:justify-center md:gap-10 [&::-webkit-scrollbar]:hidden">
          {areas.map((area) => (
            <a
              key={area.id}
              href={`#${area.id}`}
              className={cn(
                "relative shrink-0 py-4 font-display text-small font-semibold transition-colors duration-200",
                active === area.id ? "text-blue" : "text-ink-muted hover:text-ink",
              )}
            >
              {area.eyebrow}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 bottom-0 h-[2px] origin-center bg-blue transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                  active === area.id ? "scale-x-100" : "scale-x-0",
                )}
              />
            </a>
          ))}
        </Container>
      </nav>

      {areas.map((area, i) => {
        const flip = i % 2 === 1;
        return (
          <section
            key={area.id}
            id={area.id}
            className={cn("scroll-mt-32", flip ? "bg-surface-alt" : "bg-surface")}
          >
            <Container className="grid gap-10 py-16 md:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
              <Reveal className={cn("grid content-start gap-6", flip && "lg:order-2")}>
                <div className="flex items-end gap-5">
                  <span
                    aria-hidden="true"
                    className="font-display text-[64px] leading-[0.8] font-semibold tabular-nums text-blue/15 md:text-[88px]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <TwoToneIcon icon={area.icon} className="size-12 md:size-14" />
                </div>
                <div className="grid gap-3">
                  <Eyebrow>{area.eyebrow}</Eyebrow>
                  <h2 className="max-w-[18ch] font-display text-[30px] leading-[36px] font-semibold tracking-tight text-ink md:text-[42px] md:leading-[48px]">
                    {area.title}
                  </h2>
                </div>
                <p className="max-w-[46ch] text-body text-ink-muted md:text-lead">
                  {area.description}
                </p>
                <div>
                  <Button asChild variant="outline" className="group border-blue text-blue hover:bg-blue hover:text-on-blue">
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

              {/* Servicios: lista de líneas finas, numerada. */}
              <ul className={cn("m-0 list-none self-center border-t border-ink/15 p-0", flip && "lg:order-1")}>
                {area.services.map((svc, j) => (
                  <Reveal as="li" key={svc} delay={80 + j * 50}>
                    <span className="group flex items-baseline gap-5 border-b border-ink/15 py-4 md:py-5">
                      <span className="w-6 flex-none font-display text-small font-semibold tabular-nums text-sky">
                        {String(j + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-[17px] leading-[24px] font-medium text-ink transition-[transform,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1 group-hover:text-blue md:text-lg">
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
