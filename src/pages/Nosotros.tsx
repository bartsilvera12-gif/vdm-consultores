import { useMemo } from "react";
import { ShieldCheck, Rocket } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { PageCta } from "@/components/primitives/PageCta";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AreasStrip } from "@/components/sections/AreasStrip";
import { FirmHero } from "@/components/sections/FirmHero";
import { useDisciplines } from "@/hooks/useDisciplines";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useT, useTr } from "@/i18n/context";
import { anchorFor } from "@/i18n/langs";
import { useLang } from "@/i18n/context";


export function Nosotros() {
  const keys = useMemo(() => ["about.commitment" as const], []);
  const content = useSiteContent(keys);
  const { disciplines } = useDisciplines();
  const t = useT();
  const tr = useTr();
  const lang = useLang();
  const pillars = [
    { icon: ShieldCheck, title: t.about.pillar1Title, body: t.about.pillar1Body },
    { icon: Rocket, title: t.about.pillar2Title, body: t.about.pillar2Body },
  ];

  return (
    <>
      <AboutIntro />
      <FirmHero />
      <AreasStrip />
      <section id={anchorFor("la-firma", lang)} className="bg-surface-alt py-16 md:py-24">
        <Container>
          <div className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch lg:gap-8">
            {/* Columna izquierda — relato de la firma ---------------------- */}
            <div className="relative grid gap-6 overflow-hidden rounded-xl border border-line bg-surface p-7 shadow-card sm:p-9 md:p-10">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-blue-bright"
              />
              <Eyebrow>{t.about.firm}</Eyebrow>
              <p className="text-body text-ink-muted md:text-lead">
                {t.about.firmBody}
              </p>

              <div className="grid gap-3">
                <p className="font-display text-base font-semibold text-ink">
                  {t.about.disciplinesLead}
                </p>
                <div className="flex flex-wrap gap-2">
                  {disciplines.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center rounded-full border border-line bg-surface-alt px-3.5 py-1.5 text-small font-semibold text-ink transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-blue hover:bg-blue hover:text-on-blue hover:shadow-sm"
                    >
                      {tr(d)}
                    </span>
                  ))}
                </div>
              </div>

              <p className="border-t border-line pt-6 text-body text-ink-muted md:text-lead">
                {content["about.commitment"]}
              </p>
              <p className="font-display text-base font-semibold text-blue md:text-lg">
                VDM Consultores ·{" "}
                <span className="font-normal italic text-ink-muted">
                  {t.about.slogan}
                </span>
              </p>
            </div>

            {/* Columna derecha — pilares de la firma (panel navy) --------- */}
            <aside className="relative flex flex-col justify-center overflow-hidden rounded-xl bg-navy p-7 text-on-navy shadow-card sm:p-9 md:p-10">
              <div className="relative grid gap-8 md:gap-10">
                <Eyebrow tone="onNavy" className="text-[14px] md:text-[15px]">{t.about.approach}</Eyebrow>
                <ul className="m-0 grid list-none gap-8 p-0 md:gap-10">
                  {pillars.map((p) => {
                    const Icon = p.icon;
                    return (
                      <li
                        key={p.title}
                        className="grid grid-cols-[56px_1fr] items-start gap-5 border-t border-white/15 pt-8 first:border-t-0 first:pt-0 md:grid-cols-[64px_1fr] md:gap-6 md:pt-10"
                      >
                        <span className="grid size-14 place-items-center rounded-full bg-white/10 text-on-navy md:size-16">
                          <Icon className="size-7 md:size-8" aria-hidden="true" />
                        </span>
                        <div className="grid gap-3">
                          <h2 className="font-display text-[26px] leading-[32px] font-semibold text-on-navy md:text-[32px] md:leading-[38px]">
                            {p.title}
                          </h2>
                          <p className="text-[18px] leading-[28px] text-on-navy-muted md:text-[20px] md:leading-[31px]">
                            {p.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
      <PageCta />
    </>
  );
}
