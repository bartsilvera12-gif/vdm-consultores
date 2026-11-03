import { PageHero } from "@/components/primitives/PageHero";
import { PageCta } from "@/components/primitives/PageCta";
import { MediaGallery } from "@/components/sections/MediaGallery";

/** Galería: las fotos que VDM sube en /admin/imagenes. */
export function Galeria() {
  return (
    <>
      <PageHero eyebrow="Galería" title="VDM Consultores en imágenes." />
      <MediaGallery
        withHeading={false}
        emptyText="Pronto vas a ver fotos de VDM Consultores acá."
      />
      <PageCta
        title="¿Querés que te acompañemos?"
        body="Contanos tu proyecto y te ponemos en contacto con el área correcta."
      />
    </>
  );
}
