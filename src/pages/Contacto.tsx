import { PageHero } from "@/components/primitives/PageHero";
import { Contact } from "@/components/sections/Contact";

export function Contacto() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Conversemos sobre tus proyectos. Estamos para asesorarte."
        lead="Escríbenos y un profesional del área te responderá."
      />
      <Contact embedded />
    </>
  );
}
