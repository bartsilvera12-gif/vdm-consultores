import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { SectionHead } from "@/components/primitives/Section";
import { VBullet } from "@/components/primitives/VBullet";
import { Button } from "@/components/ui/button";
import { areas, type Area } from "@/content/areas";
import { preselectArea } from "@/lib/scroll-to-contact";

export function Services() {
  return (
    <section id="servicios" className="bg-surface py-16 md:py-24">
      <Container>
        <SectionHead
          eyebrow="Áreas de servicio"
          title="Cuatro áreas, un mismo acompañamiento"
          lead="Desde la constitución de tu empresa hasta la concreción de tu inversión, cada área trabaja coordinada con las demás."
        />
        <div>
          {areas.map((area) => (
            <AreaBlock key={area.id} area={area} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function AreaBlock({ area }: { area: Area }) {
  const Icon = area.icon;
  return (
    <article
      id={area.id}
      className="grid gap-6 border-t border-line py-8 last:border-b sm:gap-7 sm:py-10 lg:grid-cols-[5fr_6fr] lg:gap-16 lg:py-14"
    >
      <div className="grid content-start gap-3.5">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-md border border-line bg-surface text-blue">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <Eyebrow>{area.eyebrow}</Eyebrow>
        </div>
        <h3 className="font-display text-[24px] leading-[30px] font-semibold tracking-tight md:text-[28px] md:leading-[34px]">
          {area.title}
        </h3>
        <p className="max-w-[52ch] text-body text-ink-muted">
          {area.description}
        </p>
        <Button asChild variant="outline" className="mt-2 justify-self-start">
          <a
            href="#contacto"
            onClick={() => preselectArea(area.eyebrow)}
          >
            Consultar sobre esta área
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
        </Button>
      </div>
      <div className="min-w-0">
        <p className="pb-1.5 font-display text-eyebrow uppercase tracking-eyebrow text-ink-muted">
          Nuestros servicios
        </p>
        <ul className="m-0 grid list-none grid-cols-1 content-start p-0 sm:grid-cols-2 sm:gap-x-8">
          {area.services.map((svc) => (
            <li
              key={svc}
              className="flex items-start gap-3 border-b border-line py-3.5 text-base font-semibold leading-6"
            >
              <VBullet className="mt-1.5 text-blue" />
              {svc}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
