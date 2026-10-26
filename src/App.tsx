import { Button } from "@/components/ui/button";

export function App() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <section className="bg-navy text-on-navy">
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-12 md:py-32">
          <p className="font-display text-eyebrow uppercase tracking-eyebrow text-on-navy-muted">
            VDM Consultores
          </p>
          <h1 className="mt-6 font-display text-[36px] leading-[40px] font-semibold tracking-tight md:text-hero md:leading-hero">
            Fortaleciendo empresas,
            <br />
            <span className="text-orange">potenciando inversiones.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lead text-on-navy-muted">
            Scaffold listo. Diseño conectado a los tokens de VDM. Las secciones del
            prototipo se migrarán a React aquí.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button>Agendar consulta</Button>
            <Button variant="accent">WhatsApp</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-12 md:py-24">
        <p className="font-display text-eyebrow uppercase tracking-eyebrow text-orange-text">
          Design system
        </p>
        <h2 className="mt-4 font-display text-[28px] leading-[34px] font-semibold tracking-tight md:text-h2 md:leading-h2">
          Tokens de VDM mapeados a Tailwind
        </h2>
        <p className="mt-4 max-w-2xl text-body text-ink-muted">
          Colores, tipografías, radios y espaciado están disponibles como utilidades:
          <code className="mx-1 rounded-sm bg-surface-alt px-1 py-0.5 text-small">bg-navy</code>,
          <code className="mx-1 rounded-sm bg-surface-alt px-1 py-0.5 text-small">text-orange-text</code>,
          <code className="mx-1 rounded-sm bg-surface-alt px-1 py-0.5 text-small">font-display</code>.
        </p>
      </section>
    </main>
  );
}
