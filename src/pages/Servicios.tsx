import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { Reveal } from "@/components/primitives/Reveal";
import { TwoToneIcon } from "@/components/primitives/TwoToneIcon";
import { Button } from "@/components/ui/button";
import { useAreas } from "@/hooks/useAreas";
import { cn } from "@/lib/utils";

/** Qué área está en pantalla, para marcarla en el índice lateral. */
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

      {/* Índice en celular: pastillas que llevan a cada área. */}
      <nav
        aria-label="Servicios"
        className="sticky top-[72px] z-30 border-b border-line bg-surface/95 backdrop-blur lg:hidden"
      >
        <Container className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {areas.map((area) => (
            <a
              key={area.id}
              href={`#${area.id}`}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 font-display text-small font-medium transition-colors",
                active === area.id
                  ? "border-blue bg-blue text-on-blue"
                  : "border-line text-ink",
              )}
            >
              {area.eyebrow}
            </a>
          ))}
        </Container>
      </nav>

      <section className="bg-surface">
        <Container className="grid gap-10 py-12 md:py-20 lg:grid-cols-[240px_1fr] lg:gap-16">
          {/* Índice lateral fijo en escritorio. */}
          <aside className="hidden lg:block">
            <nav aria-label="Servicios" className="sticky top-28 grid gap-1">
              <Eyebrow className="mb-3">Servicios</Eyebrow>
              {areas.map((area, i) => (
                <a
                  key={area.id}
                  href={`#${area.id}`}
                  className={cn(
                    "group relative grid grid-cols-[32px_1fr] items-baseline gap-2 rounded-md py-2.5 pl-4 pr-2 font-display text-small transition-colors",
                    active === area.id
                      ? "text-blue"
                      : "text-ink-muted hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-y-1.5 left-0 w-[3px] origin-top rounded-full bg-sky transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                      active === area.id ? "scale-y-100" : "scale-y-0",
                    )}
                  />
                  <span className="font-semibold tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium leading-5">{area.eyebrow}</span>
                </a>
              ))}
            </nav>
          </aside>

          <div className="grid">
            {areas.map((area, i) => (
              <article
                key={area.id}
                id={area.id}
                className="grid scroll-mt-36 gap-8 border-b border-line py-12 first:pt-0 last:border-b-0 md:py-16 lg:scroll-mt-28"
              >
                <Reveal className="flex items-end justify-between gap-6">
                  <div className="grid gap-3">
                    <Eyebrow>{area.eyebrow}</Eyebrow>
                    <h2 className="max-w-[20ch] font-display text-[28px] leading-[34px] font-semibold tracking-tight text-ink md:text-[40px] md:leading-[46px]">
                      {area.title}
                    </h2>
                  </div>
                  <div className="relative hidden flex-none sm:block">
                    <span
                      aria-hidden="true"
                      className="absolute -right-2 -top-10 select-none font-display text-[120px] font-bold leading-none text-blue/[0.07]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <TwoToneIcon icon={area.icon} className="relative size-20 md:size-24" />
                  </div>
                </Reveal>

                <Reveal delay={80}>
                  <p className="max-w-[60ch] text-body text-ink-muted md:text-lead">
                    {area.description}
                  </p>
                </Reveal>

                <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
                  {area.services.map((svc, j) => (
                    <Reveal as="li" key={svc} delay={120 + j * 60}>
                      <span className="group flex h-full items-start gap-3 rounded-lg border border-line bg-surface-alt px-4 py-3.5 transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-blue/40 hover:bg-surface">
                        <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-sky/15 text-blue transition-colors group-hover:bg-blue group-hover:text-on-blue">
                          <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                        </span>
                        <span className="text-base font-semibold leading-6 text-ink">
                          {svc}
                        </span>
                      </span>
                    </Reveal>
                  ))}
                </ul>

                <Reveal delay={160}>
                  <Button asChild variant="outline" className="border-blue text-blue">
                    <Link to="/contacto" state={{ area: area.eyebrow }}>
                      Consultar sobre estos servicios
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </Reveal>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <PageCta />
    </>
  );
}
