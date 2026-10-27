import { PageHero } from "@/components/primitives/PageHero";
import { Contact } from "@/components/sections/Contact";

export function Contacto() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu empresa o tu inversión."
        lead="Escríbenos y un profesional del área te responderá."
      />
      <Contact embedded />
    </>
  );
}
