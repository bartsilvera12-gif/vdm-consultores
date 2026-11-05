import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

/** Textos editables del sitio. Las claves viven en public.vdm_site_content. */
export type SiteContentKey =
  // Hero del Inicio
  | "hero.eyebrow"
  | "hero.title_main"
  | "hero.title_em"
  | "hero.lead"
  | "hero.panel_eyebrow"
  | "hero.panel_title"
  // CTA band
  | "cta.title"
  | "cta.body"
  | "cta.button"
  // About / Nosotros
  | "about.title"
  | "about.intro"
  | "about.commitment"
  | "about.slogan"
  // Servicios (apartado)
  | "servicios.title"
  | "servicios.lead"
  // Experiencia (apartado)
  | "experiencia.title"
  | "experiencia.lead"
  // Equipo (apartado)
  | "equipo.title"
  | "equipo.lead"
  // Contacto (apartado)
  | "contacto.title"
  | "contacto.lead"
  // Textos que se ven hoy (claves nuevas: las viejas tienen guardado un diseño anterior)
  | "inicio.title"
  | "inicio.lead"
  | "inicio.button"
  | "inicio.band_button"
  | "cierre.title"
  | "cierre.button"
  | "servicios.hero_title"
  | "servicios.hero_lead"
  | "equipo.hero_title"
  | "equipo.hero_lead"
  | "experiencia.hero_title"
  | "experiencia.hero_lead"
  | "galeria.hero_title";

export const siteContentDefaults: Record<SiteContentKey, string> = {
  "hero.eyebrow": "VDM Consultores · Paraguay",
  "hero.title_main": "Fortaleciendo empresas,",
  "hero.title_em": "potenciando inversiones.",
  "hero.lead":
    "Consultoría jurídica, empresarial y de inversiones en Paraguay. Acompañamos a empresas e inversionistas nacionales y extranjeros con asesoramiento integral y seguridad jurídica en cada decisión.",
  "hero.panel_eyebrow": "Áreas de servicio",
  "hero.panel_title": "Un solo equipo, soluciones integrales.",
  "cta.title": "¿Vas a invertir o hacer crecer tu empresa en Paraguay?",
  "cta.body":
    "Cuéntanos tu proyecto. Te orientamos sobre los pasos, permisos y la estructura que necesitas.",
  "cta.button": "Agenda tu consulta",
  "about.title": "Un solo equipo, soluciones integrales.",
  "about.intro":
    "Somos VDM Consultores, una firma paraguaya de consultoría jurídica, empresarial y de inversiones, especializada en brindar asesoramiento integral a empresas e inversionistas nacionales y extranjeros.",
  "about.commitment":
    "Nuestro compromiso es brindar un servicio profesional, personalizado e integral, orientado a proteger los intereses de nuestros clientes, fortalecer sus estructuras empresariales y potenciar sus proyectos de inversión.",
  "about.slogan": "Fortaleciendo empresas, potenciando inversiones.",
  "servicios.title": "Cuatro áreas, un mismo acompañamiento.",
  "servicios.lead":
    "Desde la constitución de tu empresa hasta la concreción de tu inversión, cada área trabaja coordinada con las demás.",
  "experiencia.title": "A quiénes acompañamos.",
  "experiencia.lead": "Empresas en cada etapa e inversionistas que llegan a Paraguay.",
  "equipo.title": "Profesionales especializados en cada área.",
  "equipo.lead":
    "Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente.",
  "contacto.title": "Paraguay, país de oportunidades",
  "contacto.lead": "Agenda tu consulta",
  "inicio.title": "Su consultora de confianza en Paraguay",
  "inicio.lead":
    "Asesoramiento jurídico, empresarial y de inversiones con un enfoque integral y personalizado.",
  "inicio.button": "Conozca nuestros servicios",
  "inicio.band_button": "Contáctenos",
  "cierre.title": "Contactá con nuestro equipo y te asesoramos",
  "cierre.button": "Agenda tu consulta",
  "servicios.hero_title": "Nuestros servicios",
  "servicios.hero_lead":
    "Desde la constitución de tu empresa hasta la concreción de tu inversión, cada área trabaja coordinada con las demás.",
  "equipo.hero_title": "Profesionales especializados en cada área",
  "equipo.hero_lead":
    "Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente.",
  "experiencia.hero_title": "A quiénes acompañamos",
  "experiencia.hero_lead": "Empresas en cada etapa e inversionistas que llegan a Paraguay.",
  "galeria.hero_title": "VDM Consultores en imágenes",
};

/** Un solo texto editable (con su valor por defecto mientras carga). */
export function useText(key: SiteContentKey) {
  return useSiteContent([key])[key];
}

type Row = { key: string; value: unknown };

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join("|")]);

  return values;
}
