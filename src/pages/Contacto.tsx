import { PageHero } from "@/components/primitives/PageHero";
import { useText } from "@/hooks/useSiteContent";
import { Contact } from "@/components/sections/Contact";

export function Contacto() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title={useText("contacto.title")}
        lead={useText("contacto.lead")}
      />
      <Contact />
    </>
  );
}
