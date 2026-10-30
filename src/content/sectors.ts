import {
  Briefcase,
  TrendingUp,
  Globe2,
  Factory,
  Ship,
  KeyRound,
  type LucideIcon,
} from "lucide-react";

export type Sector = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export const sectors: Sector[] = [
  {
    icon: Briefcase,
    title: "Empresas en formación",
    body: "Constitución de sociedades, planes de negocios y apertura de cuentas.",
  },
  {
    icon: TrendingUp,
    title: "Empresas consolidadas",
    body: "Asesoría jurídica permanente, tributaria y cumplimiento normativo.",
  },
  {
    icon: Globe2,
    title: "Inversionistas extranjeros",
    body: "Radicaciones, Investor Pass, residencia y domicilio fiscal.",
  },
  {
    icon: Factory,
    title: "Industria y maquila",
    body: "Régimen de maquila, licencias ambientales, PCI y habilitaciones.",
  },
  {
    icon: Ship,
    title: "Comercio exterior",
    body: "Importación, exportación y gestión documental.",
  },
  {
    icon: KeyRound,
    title: "Inversión inmobiliaria",
    body: "Búsqueda de propiedades urbanas y rurales. Análisis y gestión documental. Tramites para adquisición de inmuebles por mandato.",
  },
];
