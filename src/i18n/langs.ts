/**
 * Idiomas del sitio público y sus rutas. Cada página tiene su dirección propia
 * en cada idioma (/es/nosotros, /en/about, /pt/sobre), así no queda ninguna
 * palabra de otro idioma ni en la URL.
 */
export const LANGS = ["es", "en", "pt"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "es";

export const LANG_NAMES: Record<Lang, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
};

/** Código para <html lang> y hreflang. */
export const LANG_TAG: Record<Lang, string> = { es: "es", en: "en", pt: "pt-BR" };

export type PageKey =
  | "home"
  | "nosotros"
  | "servicios"
  | "equipo"
  | "experiencia"
  | "galeria"
  | "contacto";

export const PAGE_KEYS: PageKey[] = [
  "home",
  "nosotros",
  "servicios",
  "equipo",
  "experiencia",
  "galeria",
  "contacto",
];

/** Segmento de cada página por idioma ("" = inicio). */
export const SLUGS: Record<PageKey, Record<Lang, string>> = {
  home: { es: "", en: "", pt: "" },
  nosotros: { es: "nosotros", en: "about", pt: "sobre" },
  servicios: { es: "servicios", en: "services", pt: "servicos" },
  equipo: { es: "equipo", en: "team", pt: "equipe" },
  experiencia: { es: "experiencia", en: "experience", pt: "experiencia" },
  galeria: { es: "galeria", en: "gallery", pt: "galeria" },
  contacto: { es: "contacto", en: "contact", pt: "contato" },
};

/**
 * Anclas dentro de las páginas. Las de las áreas salen del slug de la base
 * (juridico, consultoria…); un slug nuevo sin traducción queda igual.
 */
export const ANCHORS: Record<string, Record<Lang, string>> = {
  juridico: { es: "juridico", en: "legal", pt: "juridico" },
  consultoria: { es: "consultoria", en: "business-consulting", pt: "consultoria" },
  inversiones: { es: "inversiones", en: "investments", pt: "investimentos" },
  habilitaciones: { es: "habilitaciones", en: "permits", pt: "licenciamentos" },
  "la-firma": { es: "la-firma", en: "the-firm", pt: "a-empresa" },
};

export function anchorFor(id: string, lang: Lang) {
  return ANCHORS[id]?.[lang] ?? id;
}

export function pathFor(page: PageKey, lang: Lang, hash?: string) {
  const slug = SLUGS[page][lang];
  const base = slug ? `/${lang}/${slug}` : `/${lang}`;
  return hash ? `${base}#${anchorFor(hash, lang)}` : base;
}

/** Qué página es un pathname (/en/about → nosotros). */
export function pageFromPath(pathname: string): { lang: Lang; page: PageKey } | null {
  const [, l, slug = ""] = pathname.split("/");
  if (!(LANGS as readonly string[]).includes(l)) return null;
  const lang = l as Lang;
  const page = PAGE_KEYS.find((p) => SLUGS[p][lang] === slug.replace(/\/$/, ""));
  return page ? { lang, page } : null;
}

/** La misma página (y ancla) en otro idioma. */
export function switchPath(pathname: string, hash: string, to: Lang) {
  const cur = pageFromPath(pathname);
  if (!cur) return pathFor("home", to);
  const anchor = hash.replace(/^#/, "");
  const key = anchor
    ? Object.keys(ANCHORS).find((k) => ANCHORS[k][cur.lang] === anchor) ?? anchor
    : undefined;
  return pathFor(cur.page, to, key);
}
