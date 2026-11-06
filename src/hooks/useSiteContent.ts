import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { useLang } from "@/i18n/context";
import type { Lang } from "@/i18n/langs";

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

/**
 * Textos editables en inglés y portugués. En la base viven con el idioma
 * adelante ("en:inicio.title"); si no hay nada guardado se usa esto.
 */
export const EDITABLE_KEYS_I18N = [
  "inicio.title",
  "inicio.lead",
  "inicio.button",
  "inicio.band_button",
  "hero.lead",
  "about.commitment",
  "servicios.hero_title",
  "servicios.hero_lead",
  "equipo.hero_title",
  "equipo.hero_lead",
  "experiencia.hero_title",
  "experiencia.hero_lead",
  "galeria.hero_title",
  "contacto.title",
  "contacto.lead",
  "cierre.title",
  "cierre.button",
] as const satisfies readonly SiteContentKey[];

type I18nKey = (typeof EDITABLE_KEYS_I18N)[number];

export const siteContentTranslations: Record<"en" | "pt", Record<I18nKey, string>> = {
  en: {
    "inicio.title": "Your trusted consulting firm in Paraguay",
    "inicio.lead":
      "Legal, business and investment advisory with a comprehensive, personalized approach.",
    "inicio.button": "Explore our services",
    "inicio.band_button": "Contact us",
    "hero.lead":
      "Legal, business and investment consulting in Paraguay. We support local and foreign companies and investors with comprehensive advice and legal certainty in every decision.",
    "about.commitment":
      "Our commitment is to provide a professional, personalized and comprehensive service, focused on protecting our clients' interests, strengthening their business structures and boosting their investment projects.",
    "servicios.hero_title": "Our services",
    "servicios.hero_lead":
      "From incorporating your company to closing your investment, every area works in coordination with the others.",
    "equipo.hero_title": "Professionals specialized in every area",
    "equipo.hero_lead":
      "Consulting lawyers, accountants, architects and administrators working as one team for each client.",
    "experiencia.hero_title": "Who we work with",
    "experiencia.hero_lead": "Companies at every stage and investors coming to Paraguay.",
    "galeria.hero_title": "VDM Consultores in pictures",
    "contacto.title": "Paraguay, a land of opportunity",
    "contacto.lead": "Book a consultation",
    "cierre.title": "Contact our team and we will advise you",
    "cierre.button": "Book a consultation",
  },
  pt: {
    "inicio.title": "Sua consultoria de confiança no Paraguai",
    "inicio.lead":
      "Assessoria jurídica, empresarial e de investimentos com uma abordagem integral e personalizada.",
    "inicio.button": "Conheça nossos serviços",
    "inicio.band_button": "Fale conosco",
    "hero.lead":
      "Consultoria jurídica, empresarial e de investimentos no Paraguai. Acompanhamos empresas e investidores nacionais e estrangeiros com assessoria integral e segurança jurídica em cada decisão.",
    "about.commitment":
      "Nosso compromisso é oferecer um serviço profissional, personalizado e integral, voltado a proteger os interesses de nossos clientes, fortalecer suas estruturas empresariais e potencializar seus projetos de investimento.",
    "servicios.hero_title": "Nossos serviços",
    "servicios.hero_lead":
      "Da constituição da sua empresa à concretização do seu investimento, cada área trabalha em coordenação com as demais.",
    "equipo.hero_title": "Profissionais especializados em cada área",
    "equipo.hero_lead":
      "Consultores advogados, contadores, arquitetos e administradores que trabalham como uma só equipe para cada cliente.",
    "experiencia.hero_title": "Quem acompanhamos",
    "experiencia.hero_lead": "Empresas em todas as etapas e investidores que chegam ao Paraguai.",
    "galeria.hero_title": "VDM Consultores em imagens",
    "contacto.title": "Paraguai, país de oportunidades",
    "contacto.lead": "Agende sua consulta",
    "cierre.title": "Fale com nossa equipe e nós assessoramos você",
    "cierre.button": "Agende sua consulta",
  },
};

export function defaultFor(key: SiteContentKey, lang: Lang): string {
  if (lang === "es") return siteContentDefaults[key];
  return (siteContentTranslations[lang] as Record<string, string>)[key] ?? siteContentDefaults[key];
}

/** Clave en la base para un idioma: "inicio.title" o "en:inicio.title". */
export function storageKey(key: SiteContentKey, lang: Lang) {
  return lang === "es" ? key : `${lang}:${key}`;
}

export function useSiteContent(keys: SiteContentKey[]) {
  const lang = useLang();
  const [values, setValues] = useState<Record<SiteContentKey, string>>(() => {
    const base = {} as Record<SiteContentKey, string>;
    for (const k of keys) base[k] = defaultFor(k, lang);
    return base;
  });

  useEffect(() => {
    const base = {} as Record<SiteContentKey, string>;
    for (const k of keys) base[k] = defaultFor(k, lang);
    setValues(base);
    const client = getSupabase();
    if (!client) return;
    let cancelled = false;
    const stored = keys.map((k) => storageKey(k, lang));
    client
      .from("vdm_site_content")
      .select("key, value")
      .in("key", stored)
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setValues((prev) => {
          const next = { ...prev };
          for (const row of data as Row[]) {
            const k = keys.find((key) => storageKey(key, lang) === row.key);
            if (!k) continue;
            const v = row.value;
            const text = typeof v === "string" ? v : JSON.stringify(v);
            if (text.trim()) next[k] = text;
          }
          return next;
        });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join("|"), lang]);

  return values;
}
