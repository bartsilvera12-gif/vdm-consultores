import { Leaf, Building2, type LucideIcon } from "lucide-react";

export type Featured = {
  icon: LucideIcon;
  title: string;
  body: string;
  from: string;
};

export const featured: Featured[] = [
  {
    icon: Leaf,
    title: "Licencias ambientales",
    body: "Acompañamos el desarrollo de tu empresa identificando, previniendo y mitigando los impactos ambientales de tus proyectos. Garantizamos el estricto cumplimiento de la normativa vigente en cada etapa, impulsando un crecimiento seguro, responsable y verdaderamente sostenible.",
    from: "Habilitaciones Industriales y Comerciales",
  },
  {
    icon: Building2,
    title: "Inversiones inmobiliarias",
    body: "Identificamos las mejores opciones del mercado para convertirlas en oportunidades de inversión altamente rentables. Te acompañamos de principio a fin, desde el análisis de viabilidad técnica, comercial y legal hasta la concreción de tu inversión, minimizando riesgos y asegurando un crecimiento sostenido para tu capital.",
    from: "Asesoría en Inversiones",
  },
];
