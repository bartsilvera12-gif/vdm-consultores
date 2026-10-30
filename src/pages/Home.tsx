import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/sections/Hero";
import { CtaBand } from "@/components/sections/CtaBand";
import { useAreas } from "@/hooks/useAreas";

/**
 * Portada. Hero + un resumen compacto de áreas que dirige al apartado
 * /servicios. No duplica el contenido completo de /nosotros, /equipo o
 * /experiencia — cada apartado tiene su propia página.
 */
export function Home() {
  return (
    <>
      <Hero />
      <AreasOverview />
      <CtaBand />
    </>
  );
}

function AreasOverview() {
  const { areas } = useAreas();
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="mb-10 grid max-w-[720px] gap-4">
          <Eyebrow>Qué hacemos</Eyebrow>
          <h2 className="font-display text-[28px] leading-[34px] font-semibold tracking-h2 md:text-h2 md:leading-h2">
            Cuatro áreas, un mismo acompañamiento.
          </h2>
          <p className="text-lead text-ink-muted">
            Un solo equipo multidisciplinario para que tu empresa o inversión
            crezca con seguridad jurídica y una estrategia clara.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {areas.map((area) => {
            const Icon = area.icon;
            return (
              <li key={area.id}>
                <Link
                  to={`/servicios#${area.id}`}
                  className="group grid h-full grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg border border-line bg-surface p-5 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="grid size-11 place-items-center rounded-md border border-line bg-surface-alt text-blue">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-base font-semibold text-ink">
                      {area.eyebrow}
                    </span>
                    <span className="mt-0.5 block text-small text-ink-muted">
                      {area.summary}
                    </span>
                  </span>
                  <ArrowRight
                    className="size-4 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-blue"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/servicios">
              Ver todos los servicios
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/nosotros">Conocé la firma</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
