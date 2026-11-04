import { Hero } from "@/components/sections/Hero";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { CtaBand } from "@/components/sections/CtaBand";

/**
 * Portada. Hero + un carrusel de servicios (íconos de línea) que dirige al
 * apartado /servicios. No duplica el contenido completo de /nosotros, /equipo o
 * /experiencia — cada apartado tiene su propia página.
 */
export function Home() {
  return (
    <>
      <Hero />
      <ServicesShowcase />
      <CtaBand />
    </>
  );
}
