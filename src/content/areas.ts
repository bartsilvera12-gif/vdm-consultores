import {
  Scale,
  TrendingUp,
  Globe2,
  Factory,
  type LucideIcon,
} from "lucide-react";

export type Area = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  services: string[];
  icon: LucideIcon;
  summary: string;
};

export const areas: Area[] = [
  {
    id: "juridico",
    eyebrow: "Estudio Jurídico",
    title: "La seguridad jurídica que tu empresa necesita",
    description:
      "Protegemos tus intereses y acompañamos tus decisiones con asesoramiento jurídico especializado.",
    services: [
      "Derecho civil y comercial",
      "Societario y corporativo",
      "Administrativo",
      "Laboral y ambiental",
      "Propiedad intelectual",
      "Contratos y resolución de conflictos",
    ],
    icon: Scale,
    summary: "Civil, comercial, laboral, administrativo",
  },
  {
    id: "consultoria",
    eyebrow: "Consultoría Empresarial",
    title: "Impulsamos el crecimiento de tu empresa",
    description:
      "Te acompañamos desde la constitución de tu empresa hasta el desarrollo y consolidación de tus negocios en Paraguay.",
    services: [
      "Constitución de sociedades",
      "Planes de negocios",
      "Maquila, Régimen de Origen y otros",
      "Contabilidad y asesoría tributaria",
      "Apertura de cuentas bancarias",
      "Comercio exterior",
    ],
    icon: TrendingUp,
    summary: "Constitución de empresas, régimen maquila, contabilidad y tributación",
  },
  {
    id: "inversiones",
    eyebrow: "Asesoría en Inversiones",
    title: "Tu próxima inversión puede estar en Paraguay",
    description:
      "Acompañamos a inversionistas nacionales y extranjeros para desarrollar sus proyectos con seguridad jurídica y visión estratégica.",
    services: [
      "Radicaciones",
      "Residencia fiscal",
      "Representaciones y domicilio fiscal",
      "Inversiones inmobiliarias",
      "Negociaciones y gestión documental",
    ],
    icon: Globe2,
    summary: "Radicaciones, registro de marcas y patentes, adquisición de inmuebles",
  },
  {
    id: "habilitaciones",
    eyebrow: "Habilitaciones Industriales y Comerciales",
    title: "Tu negocio en regla, tu crecimiento en marcha",
    description:
      "Gestionamos los estudios, permisos y habilitaciones necesarios para desarrollar tus actividades industriales y comerciales.",
    services: [
      "Estudios de impacto ambiental",
      "Licencias y permisos",
      "Habilitaciones municipales",
      "Planos arquitectónicos y técnicos",
      "Protección contra Incendios (PCI)",
    ],
    icon: Factory,
    summary: "Licencia ambiental y municipal, trámites administrativos",
  },
];
