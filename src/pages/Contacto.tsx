import { PageHero } from "@/components/primitives/PageHero";
import { Contact } from "@/components/sections/Contact";

export function Contacto() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Paraguay, país de oportunidades"
        lead="Agenda tu consulta"
      />
      <Contact />
    </>
  );
}
