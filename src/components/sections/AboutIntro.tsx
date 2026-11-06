import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import { usePath, useT } from "@/i18n/context";
import giselleMesa from "@/assets/equipo/giselle-mesa.webp";

/**
 * Apertura de /nosotros, como el diseño aprobado: texto a la izquierda y el
 * retrato de la directora a la derecha, con la esquina cortada en diagonal y la
 * tarjeta del nombre sobre la parte de abajo. La foto se limita al alto de la
 * pantalla para que el bloque entre completo. Dos columnas también en celular.
 */
export function AboutIntro() {
  const t = useT();
  const path = usePath();
  return (
    <section className="bg-surface-alt pt-10 pb-6 md:pt-12 md:pb-8">
      <Container className="grid grid-cols-2 items-center gap-5 sm:gap-10 lg:gap-16">
        <div className="grid min-w-0 content-start gap-4 self-start sm:gap-6 md:pt-10">
          <div className="grid gap-3 sm:gap-4">
            <h1 className="whitespace-nowrap font-display text-[20px] leading-[26px] font-bold tracking-h2 text-ink sm:text-[30px] sm:leading-[36px] md:text-[44px] md:leading-[50px] lg:text-[52px] lg:leading-[58px]">
              {t.about.title}
            </h1>
            <span className="h-[3px] w-12 bg-sky sm:w-16" aria-hidden="true" />
          </div>
          <p className="max-w-[36rem] text-[13px] leading-[20px] text-ink-muted sm:text-[17px] sm:leading-[28px] md:text-[21px] md:leading-[35px] lg:text-[23px] lg:leading-[38px]">
            {t.about.intro}
          </p>
          <div>
            <Button asChild variant="outline" size="sm" className="group border-blue text-blue sm:h-11 sm:px-6">
              <Link to={path("nosotros", "la-firma")}>
                {t.about.learnMore}
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </div>

        <figure className="relative m-0 w-full min-w-0 md:w-auto md:justify-self-end">
          <div className="overflow-hidden rounded-xl bg-[#e9ebee] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%,0_8%)]">
            <img
              src={giselleMesa}
              alt={t.about.directorAlt}
              width={760}
              height={1342}
              loading="lazy"
              className="block h-auto w-full md:h-[min(800px,calc(100vh-110px))] md:min-h-[480px] md:w-auto"
            />
          </div>
          <figcaption className="absolute inset-x-2 bottom-2 rounded-md border-l-[3px] border-sky bg-surface px-2.5 py-1.5 sm:inset-x-6 sm:bottom-6 sm:px-5 sm:py-3">
            <span className="block whitespace-nowrap font-display text-[12.5px] leading-[18px] font-semibold text-ink sm:text-[17px] sm:leading-[24px]">
              {t.about.directorName}
            </span>
            <span className="block text-[12px] leading-[16px] text-ink-muted sm:text-small">
              {t.about.directorRole}
            </span>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
