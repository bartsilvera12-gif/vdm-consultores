import { ArrowRight } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section
      aria-labelledby="band-h"
      className="relative overflow-hidden bg-navy text-on-navy"
    >
      {/* Diagonal V art, inspired by the logo. Hidden on mobile. */}
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
            fill="var(--vdm-orange)"
          />
          <polygon
            points="250,-10 420,-10 420,330 360,330"
            fill="var(--vdm-blue)"
          />
        </svg>
      </div>
      <Container className="relative z-10 grid gap-6 py-16 md:py-22 lg:pr-[440px] xl:pr-12">
        <div className="max-w-[640px]">
          <h2
            id="band-h"
            className="font-display text-[28px] leading-[34px] font-semibold text-on-navy md:text-h2 md:leading-h2"
          >
            ¿Vas a invertir o hacer crecer tu empresa en{" "}
            <em className="not-italic text-orange">Paraguay</em>?
          </h2>
          <p className="mt-3 max-w-[560px] text-body text-on-navy-muted">
            Cuéntanos tu proyecto. Te orientamos sobre los pasos, permisos y la
            estructura que necesitas.
          </p>
        </div>
        <div>
          <Button asChild variant="accent">
            <a href="#contacto">
              Agenda tu consulta
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
        </div>
      </Container>
    </section>
  );
}
