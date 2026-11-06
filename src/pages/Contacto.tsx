import { PageHero } from "@/components/primitives/PageHero";
import { useText } from "@/hooks/useSiteContent";
import { Contact } from "@/components/sections/Contact";
import { useT } from "@/i18n/context";

export function Contacto() {
  const t = useT();
  return (
    <>
      <PageHero
        eyebrow={t.contact.eyebrow}
        title={useText("contacto.title")}
        lead={useText("contacto.lead")}
      />
      <Contact />
    </>
  );
}
