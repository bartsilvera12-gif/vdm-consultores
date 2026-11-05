import { PageHero } from "@/components/primitives/PageHero";
import { useText } from "@/hooks/useSiteContent";
import { PageCta } from "@/components/primitives/PageCta";
import { MediaGallery } from "@/components/sections/MediaGallery";

/** Galería: las fotos que VDM sube en /admin/imagenes. */
export function Galeria() {
  return (
    <>
      <PageHero eyebrow="Galería" title={useText("galeria.hero_title")} />
      <MediaGallery
        withHeading={false}
        emptyText="Pronto vas a ver fotos de VDM Consultores acá."
      />
      <PageCta />
    </>
  );
}
