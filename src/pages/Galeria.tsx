import { PageHero } from "@/components/primitives/PageHero";
import { useText } from "@/hooks/useSiteContent";
import { PageCta } from "@/components/primitives/PageCta";
import { MediaGallery } from "@/components/sections/MediaGallery";
import { useT } from "@/i18n/context";

/** Galería: las fotos que VDM sube en /admin/imagenes. */
export function Galeria() {
  const t = useT();
  return (
    <>
      <PageHero eyebrow={t.gallery.eyebrow} title={useText("galeria.hero_title")} />
      <MediaGallery
        withHeading={false}
        emptyText={t.gallery.empty}
      />
      <PageCta />
    </>
  );
}
