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
 * CTA de cierre al final de cada apartado interno. Lleva al apartado de
 * contacto por defecto.
 */
export function PageCta({
  title,
  body = "Hablá con un profesional del área. Te respondemos a la brevedad.",
  to = "/contacto",
  cta = "Agendá tu consulta",
}: PageCtaProps) {
  return (
    <section className="border-t border-line bg-surface-alt">
      <Container className="grid gap-5 py-14 md:grid-cols-[1fr_auto] md:items-center md:py-16">
        <div>
          <h2 className="font-display text-[24px] leading-[30px] font-semibold md:text-[28px] md:leading-[34px]">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-body text-ink-muted">{body}</p>
        </div>
        <Button asChild size="lg" className="justify-self-start md:justify-self-end">
          <Link to={to}>
            {cta}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </Container>
    </section>
  );
}
