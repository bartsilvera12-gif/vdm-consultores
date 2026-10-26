import { Section, SectionHead } from "@/components/primitives/Section";
import { featured } from "@/content/featured";

export function Featured() {
  return (
    <Section id="destacados">
      <SectionHead
        eyebrow="Servicios destacados"
        title="Crecer de forma segura, rentable y sostenible"
      />
      <div className="grid gap-6 md:grid-cols-2">
        {featured.map((item) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className="grid content-start gap-4 rounded-lg border border-line p-8 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-card"
            >
              <span className="grid size-10 place-items-center rounded-md border border-line bg-surface text-blue">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-[24px] leading-[30px] font-semibold text-ink">
                {item.title}
              </h3>
              <p className="text-body text-ink-muted">{item.body}</p>
              <p className="text-small text-ink-muted">
                Parte de <b className="font-semibold text-blue">{item.from}</b>
              </p>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
