import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "./Container";
import { Button } from "@/components/ui/button";
import { useText } from "@/hooks/useSiteContent";
import { usePath } from "@/i18n/context";

type PageCtaProps = {
  title?: string;
  to?: string;
  cta?: string;
};

/**
 * CTA de cierre al final de cada apartado interno: banda navy con una sola
 * línea alineada al botón. Lleva al apartado de contacto por defecto.
 */
export function PageCta({ title: titleProp, to: toProp, cta: ctaProp }: PageCtaProps) {
  const path = usePath();
  const to = toProp ?? path("contacto");
  const savedTitle = useText("cierre.title");
  const savedCta = useText("cierre.button");
  const title = titleProp ?? savedTitle;
  const cta = ctaProp ?? savedCta;
  return (
    <section className="relative overflow-hidden bg-navy text-on-navy">
      <Container className="relative z-10 grid gap-5 py-14 md:grid-cols-[1fr_auto] md:items-center md:py-16">
        <h2 className="font-display text-[24px] leading-[30px] font-semibold text-on-navy md:text-[28px] md:leading-[34px]">
          {title}
        </h2>
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
