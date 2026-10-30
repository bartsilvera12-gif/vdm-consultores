import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "./Container";
import { Button } from "@/components/ui/button";

type PageCtaProps = {
  title: string;
  body?: string;
  to?: string;
  cta?: string;
};

/**
 * CTA de cierre al final de cada apartado interno. Banda navy con una forma
 * diagonal azul (inspirada en PKF) y un botón claro. Lleva al apartado de
 * contacto por defecto.
 */
export function PageCta({
  title,
  body = "Hablá con un profesional del área. Te respondemos a la brevedad.",
  to = "/contacto",
  cta = "Agendá tu consulta",
}: PageCtaProps) {
  return (
    <section className="relative overflow-hidden bg-navy text-on-navy">
      {/* Forma diagonal azul al borde derecho (sello estilo PKF). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[460px] md:block"
      >
        <svg
          viewBox="0 0 460 320"
          preserveAspectRatio="xMaxYMid slice"
          className="h-full w-full"
        >
          <polygon points="150,-10 230,-10 340,330 260,330" fill="var(--vdm-blue-bright)" />
          <polygon points="300,-10 460,-10 460,330 400,330" fill="var(--vdm-blue)" />
        </svg>
      </div>
      <Container className="relative z-10 grid gap-5 py-14 md:grid-cols-[1fr_auto] md:items-center md:py-16">
        <div>
          <h2 className="max-w-2xl font-display text-[24px] leading-[30px] font-semibold text-on-navy md:text-[28px] md:leading-[34px]">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-body text-on-navy-muted">{body}</p>
        </div>
        <Button
          asChild
          variant="onNavy"
          size="lg"
          className="justify-self-start md:justify-self-end"
        >
          <Link to={to}>
            {cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </section>
  );
}
