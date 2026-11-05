import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://vdmconsultores.com.py";
const BRAND = "VDM Consultores";

/**
 * Título, descripción y URL canónica de cada página, para Google. Las
 * descripciones son los textos que ya muestra cada página. La del inicio es
 * la de index.html.
 */
const PAGES: Record<string, { title?: string; description?: string }> = {
  "/": {},
  "/nosotros": {
    title: "Quiénes somos",
    description:
      "Somos una consultora paraguaya especializada en brindar asesoría jurídica, empresarial y de inversiones, con un enfoque multidisciplinario, integral, técnico y estratégico.",
  },
  "/servicios": {
    title: "Servicios",
    description:
      "Desde la constitución de tu empresa hasta la concreción de tu inversión, cada área trabaja coordinada con las demás.",
  },
  "/equipo": {
    title: "Equipo",
    description:
      "Abogados, consultores y técnicos que trabajan como un solo equipo para cada cliente.",
  },
  "/experiencia": {
    title: "Experiencia",
    description: "Empresas en cada etapa e inversionistas que llegan a Paraguay.",
  },
  "/galeria": { title: "Galería" },
  "/contacto": { title: "Contacto", description: "Paraguay, país de oportunidades. Agenda tu consulta." },
};

function setMeta(selector: string, create: () => HTMLElement, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export function PageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const path = pathname.replace(/\/+$/, "") || "/";
    const page = PAGES[path] ?? {};
    const defaultDescription =
      document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.dataset.default ??
      document.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ??
      "";
    const descEl = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (descEl && !descEl.dataset.default) descEl.dataset.default = descEl.content;

    document.title = page.title ? `${page.title} | ${BRAND}` : BRAND;
    setMeta(
      'meta[name="description"]',
      () => Object.assign(document.createElement("meta"), { name: "description" }),
      "content",
      page.description ?? defaultDescription,
    );
    setMeta(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      "href",
      `${SITE}${path === "/" ? "/" : path}`,
    );
  }, [pathname]);
  return null;
}
