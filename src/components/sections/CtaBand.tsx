import { Link } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";

/**
 * Franja navy minimalista (inspirada en PKF): una línea naranja superior y un
 * único botón centrado. Sin titular ni párrafo.
 */
export function CtaBand() {
  return (
    <section
      aria-label="Llamado a la acción"
      className="relative overflow-hidden bg-navy text-on-navy"
    >
      {/* Línea naranja superior a lo ancho. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-orange"
      />
      {/* Diagonal V art, inspirado en el logo. Oculto en mobile. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[420px] md:block"
      >
        <svg
          viewBox="0 0 420 320"
          preserveAspectRatio="xMaxYMid slice"
          className="h-full w-full"
        >
          <polygon
            points="120,-10 190,-10 300,330 230,330"
            fill="var(--vdm-blue-bright)"
          />
          <polygon
            points="250,-10 420,-10 420,330 360,330"
            fill="var(--vdm-blue)"
          />
        </svg>
      </div>
      <Container className="relative z-10 grid place-items-center py-12 md:py-16">
        <Button asChild variant="accent" size="lg">
          <Link to="/contacto">Contáctenos</Link>
        </Button>
      </Container>
    </section>
  );
}
