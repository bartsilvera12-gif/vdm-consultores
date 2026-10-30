import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { useSectors } from "@/hooks/useSectors";

export function Experiencia() {
  const { sectors } = useSectors();
  return (
    <>
      <PageHero
        eyebrow="Experiencia"
        title="A quiénes acompañamos."
        lead="Empresas en cada etapa e inversionistas que llegan a Paraguay."
      />
      <section className="bg-surface-alt py-16 md:py-24">
        <Container>
          <div className="mb-8 flex items-center gap-3">
            <span className="h-[3px] w-10 bg-blue-bright" aria-hidden="true" />
            <Eyebrow>Sectores que acompañamos</Eyebrow>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector, i) => {
              const Icon = sector.icon;
              return (
                <article
                  key={sector.title}
                  className="group relative grid content-start gap-3 overflow-hidden rounded-xl border border-line bg-surface p-6 shadow-card transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,30,51,0.12)]"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-5 top-4 font-display text-[40px] font-bold leading-none text-blue/10"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid size-12 place-items-center rounded-full bg-blue/10 text-blue transition-colors group-hover:bg-blue group-hover:text-on-blue">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h2 className="font-display text-h3 leading-h3 font-semibold text-ink">
                    {sector.title}
                  </h2>
                  <p className="text-small leading-[23px] text-ink-muted">
                    {sector.body}
                  </p>
                </article>
              );
            })}
          </div>
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-small text-ink-muted">
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
