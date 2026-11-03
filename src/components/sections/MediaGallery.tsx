import { useEffect, useState } from "react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { getSupabase } from "@/lib/supabase";

// Mismo bucket y carpeta que /admin/imagenes (EditMedia.tsx).
const BUCKET = "vdm-media";
const PREFIX = "media";

/**
 * Galería de /nosotros: muestra las fotos subidas en /admin/imagenes, la más
 * nueva primero. Sin fotos (o si Supabase no responde) no se muestra nada.
 */
export function MediaGallery() {
  const [urls, setUrls] = useState<string[]>([]);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    let alive = true;
    void client.storage
      .from(BUCKET)
      .list(PREFIX, { limit: 60, sortBy: { column: "created_at", order: "desc" } })
      .then(({ data }) => {
        if (!alive || !data) return;
        setUrls(
          data
            .filter((f) => f.name && !f.name.endsWith("/") && f.id)
            .map(
              (f) =>
                client.storage.from(BUCKET).getPublicUrl(`${PREFIX}/${f.name}`)
                  .data.publicUrl,
            ),
        );
      });
    return () => {
      alive = false;
    };
  }, []);

  if (urls.length === 0) return null;

  return (
    <section className="bg-surface py-12 md:py-20">
      <Container>
        <div className="mb-6 grid gap-3 md:mb-10">
          <Eyebrow>Galería</Eyebrow>
          <h2 className="font-display text-[22px] leading-[28px] font-bold tracking-h2 text-ink sm:text-[28px] sm:leading-[34px] md:text-h2 md:leading-h2">
            VDM Consultores en imágenes
          </h2>
          <span className="h-[3px] w-12 bg-orange" aria-hidden="true" />
        </div>
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3 md:gap-5">
          {urls.map((url) => (
            <li key={url} className="min-w-0">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="group block overflow-hidden rounded-lg border border-line bg-surface-alt"
              >
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
                />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
