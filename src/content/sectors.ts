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
    body: "Constitución de empresas, planes de negocios y apertura de cuentas bancarias personales y corporativas.",
  },
  {
    icon: TrendingUp,
    title: "Empresas consolidadas",
    body: "Asesoría jurídica en materia civil y comercial. Servicio de contabilidad y asesoría tributaria. Due diligence.",
  },
  {
    icon: Globe2,
    title: "Inversionistas extranjeros",
    body: "Radicaciones, Investor Pass, residencia fiscal, representación y domicilio fiscal, adquisición de inmuebles u otros bienes en Paraguay.",
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
