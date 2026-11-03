import { Hero } from "@/components/sections/Hero";
import { AboutIntro } from "@/components/sections/AboutIntro";
import { AreasStrip } from "@/components/sections/AreasStrip";
import { ServicesShowcase } from "@/components/sections/ServicesShowcase";
import { CtaBand } from "@/components/sections/CtaBand";

/**
 * Portada. Quiénes somos + Hero + áreas como en el diseño aprobado, y un
 * carrusel de áreas (con íconos luminosos) que dirige al apartado /servicios. No duplica el contenido completo de /nosotros, /equipo o
 * /experiencia — cada apartado tiene su propia página.
 */
export function Home() {
  return (
    <>
      <AboutIntro />
      <Hero />
      <AreasStrip />
      <ServicesShowcase />
      <CtaBand />
    </>
  );
}
