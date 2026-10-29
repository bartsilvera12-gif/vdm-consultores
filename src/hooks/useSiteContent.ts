import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

/** Textos editables del sitio. Las claves están en public.vdm_site_content. */
export type SiteContentKey =
  | "hero.lead"
  | "about.intro"
  | "about.commitment";

/** Defaults si Supabase no responde o la clave aún no existe. */
export const siteContentDefaults: Record<SiteContentKey, string> = {
  "hero.lead":
    "Firma paraguaya de consultoría jurídica, empresarial y de inversiones. Acompañamos a empresas e inversionistas nacionales y extranjeros con asesoramiento integral y seguridad jurídica en cada decisión.",
  "about.intro":
    "Somos VDM Consultores, una firma paraguaya de consultoría jurídica, empresarial y de inversiones, especializada en brindar asesoramiento integral a empresas e inversionistas nacionales y extranjeros.",
  "about.commitment":
    "Nuestro compromiso es brindar un servicio profesional, personalizado e integral, orientado a proteger los intereses de nuestros clientes, fortalecer sus estructuras empresariales y potenciar sus proyectos de inversión.",
};

type Row = { key: string; value: unknown };

/**
 * Lee una o varias claves de vdm_site_content en una sola query y las
 * mergea con los defaults. Siempre devuelve un string por clave; nunca
 * null.
 */
export function useSiteContent(keys: SiteContentKey[]) {
  const [values, setValues] = useState<Record<SiteContentKey, string>>(() => {
    const base = {} as Record<SiteContentKey, string>;
    for (const k of keys) base[k] = siteContentDefaults[k];
    return base;
  });

  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    let cancelled = false;
    client
      .from("vdm_site_content")
      .select("key, value")
      .in("key", keys)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setValues((prev) => {
          const next = { ...prev };
          for (const row of data as Row[]) {
            if ((keys as string[]).includes(row.key)) {
              // El valor en DB es jsonb; para claves simples lo guardamos
              // como string JSON. Si viene objeto/otros tipos, serializamos.
              const v = row.value;
              next[row.key as SiteContentKey] =
                typeof v === "string" ? v : JSON.stringify(v);
            }
          }
          return next;
        });
      });
    return () => {
      cancelled = true;
    };
    // Serializamos la lista para que el effect no se dispare por re-renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join("|")]);

  return values;
}
