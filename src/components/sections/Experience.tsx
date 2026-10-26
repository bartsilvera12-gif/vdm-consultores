import { Container } from "@/components/primitives/Container";
import { SectionHead } from "@/components/primitives/Section";
import { sectors } from "@/content/sectors";

export function Experience() {
  return (
    <section id="experiencia" className="bg-surface-alt py-16 md:py-24">
      <Container>
        <SectionHead
          eyebrow="Experiencia"
          title="A quiénes acompañamos"
          lead="Empresas en cada etapa e inversionistas que llegan a Paraguay."
        />
        <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.title}
                className="grid gap-1.5 border-b border-line py-6 pr-6"
              >
                <h3 className="flex items-center gap-3 font-display text-base font-semibold leading-6 text-ink">
                  <Icon className="size-5 shrink-0 text-blue" aria-hidden="true" />
                  {sector.title}
                </h3>
                <p className="text-small leading-[23px] text-ink-muted">
                  {sector.body}
                </p>
              </div>
            );
          })}
        </div>
        <p className="mt-6 inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-3 py-1.5 text-small text-ink-muted">
          <span className="block size-2 shrink-0 rounded-full bg-orange" />
          Espacio para casos y proyectos: se publican solo con autorización del
          cliente.
        </p>
      </Container>
    </section>
  );
}
