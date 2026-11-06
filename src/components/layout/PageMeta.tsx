import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLang, useT } from "@/i18n/context";
import { LANGS, LANG_TAG, pageFromPath, pathFor, type PageKey } from "@/i18n/langs";
import { siteContentDefaults, siteContentTranslations } from "@/hooks/useSiteContent";

const SITE = "https://vdmconsultores.com.py";
const BRAND = "VDM Consultores";

function upsert(selector: string, create: () => HTMLElement, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
}

/**
 * Título, descripción, canónica y versiones en otros idiomas (hreflang) de
 * cada página. Las descripciones son textos que la página ya muestra.
 */
export function PageMeta() {
  const { pathname } = useLocation();
  const lang = useLang();
  const t = useT();

  useEffect(() => {
    const page: PageKey = pageFromPath(pathname)?.page ?? "home";
    const lead = (key: keyof (typeof siteContentTranslations)["en"]) =>
      lang === "es" ? siteContentDefaults[key] : siteContentTranslations[lang][key];
    const descriptions: Record<PageKey, string> = {
      home: t.meta.homeDescription,
      nosotros: t.about.intro,
      servicios: lead("servicios.hero_lead"),
      equipo: lead("equipo.hero_lead"),
      experiencia: lead("experiencia.hero_lead"),
      galeria: t.meta.homeDescription,
      contacto: t.meta.contactDescription,
    };
    document.title = page === "home" ? BRAND : `${t.meta[page]} | ${BRAND}`;
    upsert('meta[name="description"]', () => Object.assign(document.createElement("meta"), { name: "description" }), {
      content: descriptions[page],
    });
    upsert('link[rel="canonical"]', () => Object.assign(document.createElement("link"), { rel: "canonical" }), {
      href: SITE + pathFor(page, lang),
    });
    for (const l of LANGS) {
      upsert(`link[rel="alternate"][hreflang="${LANG_TAG[l]}"]`, () => document.createElement("link"), {
        rel: "alternate",
        hreflang: LANG_TAG[l],
        href: SITE + pathFor(page, l),
      });
    }
    upsert('link[rel="alternate"][hreflang="x-default"]', () => document.createElement("link"), {
      rel: "alternate",
      hreflang: "x-default",
      href: SITE + pathFor(page, "es"),
    });
  }, [pathname, lang, t]);
  return null;
}
