import { Link } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";
import { useText } from "@/hooks/useSiteContent";
import { usePath, useT } from "@/i18n/context";

/**
 * Franja navy minimalista (inspirada en PKF): una línea azul superior y un
 * único botón centrado. Sin titular ni párrafo.
 */
export function CtaBand() {
  const label = useText("inicio.band_button");
  const path = usePath();
  const t = useT();
  return (
    <section
      aria-label={t.common.ctaBand}
      className="relative overflow-hidden bg-navy text-on-navy"
    >
      {/* Línea azul superior a lo ancho. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-blue-bright"
      />
      <Container className="relative z-10 grid place-items-center py-12 md:py-16">
        <Button asChild variant="accent" size="lg">
          <Link to={path("contacto")}>{label}</Link>
        </Button>
      </Container>
    </section>
  );
}
