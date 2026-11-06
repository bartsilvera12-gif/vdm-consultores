import type { Lang } from "./langs";

/**
 * Traducciones del contenido que VDM carga en español desde el panel (áreas,
 * servicios, sectores, equipo, disciplinas, datos de contacto), más los
 * valores de respaldo de src/content que se ven mientras carga la base.
 *
 * La clave es el texto exacto en español. Si VDM cambia un texto en el panel,
 * hay que sumar acá su traducción; mientras tanto se muestra en español.
 */
type Entry = { en: string; pt: string };

const CONTENT: Record<string, Entry> = {
  // --- Áreas: nombre ------------------------------------------------------
  "Estudio Jurídico": { en: "Law Firm", pt: "Escritório Jurídico" },
  "Consultoría Empresarial": { en: "Business Consulting", pt: "Consultoria Empresarial" },
  "Asesoría en Inversiones": { en: "Investment Advisory", pt: "Assessoria em Investimentos" },
  "Habilitaciones Industriales y Comerciales": {
    en: "Industrial and Commercial Permits",
    pt: "Licenciamentos Industriais e Comerciais",
  },
  // --- Áreas: título ------------------------------------------------------
  "La seguridad jurídica que tu empresa necesita": {
    en: "The legal certainty your company needs",
    pt: "A segurança jurídica de que sua empresa precisa",
  },
  "Impulsamos el crecimiento de tu empresa": {
    en: "We drive your company's growth",
    pt: "Impulsionamos o crescimento da sua empresa",
  },
  "Tu próxima inversión puede estar en Paraguay": {
    en: "Your next investment could be in Paraguay",
    pt: "Seu próximo investimento pode estar no Paraguai",
  },
  "Tu negocio en regla, tu crecimiento en marcha": {
    en: "Your business compliant, your growth underway",
    pt: "Seu negócio em dia, seu crescimento em andamento",
  },
  // --- Áreas: descripción -------------------------------------------------
  "Protegemos tus intereses y acompañamos tus decisiones con asesoramiento jurídico especializado.": {
    en: "We protect your interests and support your decisions with specialized legal advice.",
    pt: "Protegemos seus interesses e acompanhamos suas decisões com assessoria jurídica especializada.",
  },
  "Te acompañamos desde la constitución de tu empresa hasta el desarrollo y consolidación de tus negocios en Paraguay.": {
    en: "We support you from incorporating your company to developing and consolidating your business in Paraguay.",
    pt: "Acompanhamos você desde a constituição da sua empresa até o desenvolvimento e a consolidação dos seus negócios no Paraguai.",
  },
  "Acompañamos a inversionistas nacionales y extranjeros para desarrollar sus proyectos con seguridad jurídica y visión estratégica.": {
    en: "We support local and foreign investors in developing their projects with legal certainty and strategic vision.",
    pt: "Acompanhamos investidores nacionais e estrangeiros no desenvolvimento de seus projetos com segurança jurídica e visão estratégica.",
  },
  "Gestionamos los estudios, permisos y habilitaciones necesarios para desarrollar tus actividades industriales y comerciales.": {
    en: "We handle the studies, permits and licenses required to carry out your industrial and commercial activities.",
    pt: "Gerenciamos os estudos, permissões e licenciamentos necessários para desenvolver suas atividades industriais e comerciais.",
  },
  // --- Servicios de cada área --------------------------------------------
  "Derecho civil y comercial": { en: "Civil and commercial law", pt: "Direito civil e comercial" },
  "Contencioso-administrativo": { en: "Administrative litigation", pt: "Contencioso administrativo" },
  "Propiedad intelectual": { en: "Intellectual property", pt: "Propriedade intelectual" },
  "Derecho societario y corporativo": { en: "Corporate and company law", pt: "Direito societário e corporativo" },
  "Societario y corporativo": { en: "Corporate and company law", pt: "Societário e corporativo" },
  Administrativo: { en: "Administrative law", pt: "Administrativo" },
  "Laboral y ambiental": { en: "Labor and environmental law", pt: "Trabalhista e ambiental" },
  "Contratos y resolución de conflictos": {
    en: "Contracts and dispute resolution",
    pt: "Contratos e resolução de conflitos",
  },
  "Constitución de sociedades": { en: "Company incorporation", pt: "Constituição de sociedades" },
  "Planes de negocios": { en: "Business plans", pt: "Planos de negócios" },
  "Maquila, Régimen de Origen y otros": {
    en: "Maquila, Rules of Origin regime and others",
    pt: "Maquila, Regime de Origem e outros",
  },
  "Contabilidad y asesoría tributaria": {
    en: "Accounting and tax advisory",
    pt: "Contabilidade e assessoria tributária",
  },
  "Apertura de cuentas bancarias": { en: "Bank account opening", pt: "Abertura de contas bancárias" },
  "Comercio exterior": { en: "Foreign trade", pt: "Comércio exterior" },
  Radicaciones: { en: "Residency applications", pt: "Radicações" },
  "Investor Pass": { en: "Investor Pass", pt: "Investor Pass" },
  "Residencia fiscal": { en: "Tax residency", pt: "Residência fiscal" },
  "Representaciones y domicilio fiscal": {
    en: "Representation and tax domicile",
    pt: "Representações e domicílio fiscal",
  },
  "Inversiones inmobiliarias": { en: "Real estate investments", pt: "Investimentos imobiliários" },
  "Negociaciones y gestión documental": {
    en: "Negotiations and document management",
    pt: "Negociações e gestão documental",
  },
  "Estudios de impacto ambiental": {
    en: "Environmental impact studies",
    pt: "Estudos de impacto ambiental",
  },
  "Licencias y permisos": { en: "Licenses and permits", pt: "Licenças e permissões" },
  "Habilitaciones municipales": { en: "Municipal permits", pt: "Alvarás municipais" },
  "Planos arquitectónicos y técnicos": {
    en: "Architectural and technical drawings",
    pt: "Plantas arquitetônicas e técnicas",
  },
  "Protección contra Incendios (PCI)": {
    en: "Fire Protection (PCI)",
    pt: "Proteção contra Incêndios (PCI)",
  },
  // --- Sectores (Experiencia) --------------------------------------------
  "Empresas en formación": { en: "Companies being formed", pt: "Empresas em formação" },
  "Empresas consolidadas": { en: "Established companies", pt: "Empresas consolidadas" },
  "Inversionistas extranjeros": { en: "Foreign investors", pt: "Investidores estrangeiros" },
  "Industria y maquila": { en: "Industry and maquila", pt: "Indústria e maquila" },
  "Inversión inmobiliaria": { en: "Real estate investment", pt: "Investimento imobiliário" },
  "Constitución de empresas, planes de negocios y apertura de cuentas bancarias personales y corporativas.": {
    en: "Company incorporation, business plans and opening of personal and corporate bank accounts.",
    pt: "Constituição de empresas, planos de negócios e abertura de contas bancárias pessoais e corporativas.",
  },
  "Asesoría jurídica en materia civil y comercial. Servicio de contabilidad y asesoría tributaria. Due diligence.": {
    en: "Legal advice on civil and commercial matters. Accounting services and tax advisory. Due diligence.",
    pt: "Assessoria jurídica em matéria civil e comercial. Serviço de contabilidade e assessoria tributária. Due diligence.",
  },
  "Búsqueda de propiedades urbanas y rurales. Análisis y gestión documental. Tramites para adquisición de inmuebles por mandato.": {
    en: "Search for urban and rural properties. Document review and management. Property acquisition procedures under power of attorney.",
    pt: "Busca de imóveis urbanos e rurais. Análise e gestão documental. Trâmites para aquisição de imóveis por procuração.",
  },
  "Régimen de maquila, régimen de origen, licencias ambientales, PCI y habilitaciones.": {
    en: "Maquila regime, rules of origin regime, environmental licenses, fire protection (PCI) and permits.",
    pt: "Regime de maquila, regime de origem, licenças ambientais, PCI e licenciamentos.",
  },
  "Régimen de maquila, licencias ambientales, PCI y habilitaciones.": {
    en: "Maquila regime, environmental licenses, fire protection (PCI) and permits.",
    pt: "Regime de maquila, licenças ambientais, PCI e licenciamentos.",
  },
  "Asesoría en gestiones de importación y exportación, manejo de ventanillas únicas, gestión documental, gestiones bancarias y despacho.": {
    en: "Advice on import and export procedures, single-window systems, document management, banking procedures and customs clearance.",
    pt: "Assessoria em trâmites de importação e exportação, uso de guichês únicos, gestão documental, trâmites bancários e despacho aduaneiro.",
  },
  "Importación, exportación y gestión documental.": {
    en: "Import, export and document management.",
    pt: "Importação, exportação e gestão documental.",
  },
  "Radicaciones, Investor Pass, residencia fiscal, representación y domicilio fiscal, adquisición de inmuebles u otros bienes en Paraguay.": {
    en: "Residency applications, Investor Pass, tax residency, representation and tax domicile, acquisition of real estate or other assets in Paraguay.",
    pt: "Radicações, Investor Pass, residência fiscal, representação e domicílio fiscal, aquisição de imóveis ou outros bens no Paraguai.",
  },
  // --- Equipo: cargos ----------------------------------------------------
  "Directora General y Responsable del Área de Inversiones y Licencias Ambientales": {
    en: "Managing Director and Head of Investments and Environmental Licenses",
    pt: "Diretora-Geral e Responsável pela Área de Investimentos e Licenças Ambientais",
  },
  "Responsable del Área Jurídica": { en: "Head of Legal", pt: "Responsável pela Área Jurídica" },
  "Coordinadora de Ética, Cumplimiento y Desarrollo Organizacional": {
    en: "Ethics, Compliance and Organizational Development Coordinator",
    pt: "Coordenadora de Ética, Compliance e Desenvolvimento Organizacional",
  },
  "Asesora Comercial": { en: "Sales Advisor", pt: "Assessora Comercial" },
  "Asesor Tributario": { en: "Tax Advisor", pt: "Assessor Tributário" },
  "Responsable del Área Arquitectura": {
    en: "Head of Architecture",
    pt: "Responsável pela Área de Arquitetura",
  },
  "Responsable del Área administrativa y tributaria": {
    en: "Head of Administration and Tax",
    pt: "Responsável pela Área Administrativa e Tributária",
  },
  // Respaldo mientras carga la base
  "Nombre y apellido": { en: "Full name", pt: "Nome completo" },
  "Socio · Estudio Jurídico": { en: "Partner · Law Firm", pt: "Sócio · Escritório Jurídico" },
  Habilitaciones: { en: "Permits", pt: "Licenciamentos" },
  // --- Disciplinas (Quiénes somos) ---------------------------------------
  Jurídica: { en: "Legal", pt: "Jurídica" },
  Tributaria: { en: "Tax", pt: "Tributária" },
  Empresarial: { en: "Business", pt: "Empresarial" },
  Ambiental: { en: "Environmental", pt: "Ambiental" },
  Migratoria: { en: "Immigration", pt: "Migratória" },
  Industrial: { en: "Industrial", pt: "Industrial" },
  "Registro de Marcas": { en: "Trademark Registration", pt: "Registro de Marcas" },
  // --- Datos de contacto -------------------------------------------------
  Oficina: { en: "Office", pt: "Escritório" },
  Correo: { en: "Email", pt: "E-mail" },
  "Enlace a confirmar": { en: "Link to be confirmed", pt: "Link a confirmar" },
  "Caballero 893 casi Manuel Domínguez, Barrio La Catedral, Asunción": {
    en: "Caballero 893, near Manuel Domínguez, La Catedral neighborhood, Asunción",
    pt: "Caballero 893, quase esquina com Manuel Domínguez, bairro La Catedral, Assunção",
  },
};

/** Títulos que van antes del nombre (Mgtr., Abg., Lic., Arq.). */
const NAME_PREFIX: Record<string, Entry> = {
  "Mgtr.": { en: "", pt: "Me." },
  "Abg.": { en: "", pt: "Adv." },
  "Lic.": { en: "", pt: "" },
  "Arq.": { en: "", pt: "Arq." },
};

export function translateContent(text: string, lang: Lang): string {
  if (lang === "es" || !text) return text;
  const hit = CONTENT[text.trim()];
  if (hit) return hit[lang];
  if (import.meta.env.DEV) console.warn(`[i18n] falta traducción (${lang}):`, text);
  return text;
}

/** "Mgtr. Giselle Vera" → "Giselle Vera, MSc" / "Me. Giselle Vera". */
export function translateName(name: string, lang: Lang): string {
  if (lang === "es") return name;
  const m = name.match(/^(\S+\.)\s+(.*)$/);
  if (!m || !NAME_PREFIX[m[1]]) return name;
  const prefix = NAME_PREFIX[m[1]][lang];
  if (lang === "en" && m[1] === "Mgtr.") return `${m[2]}, MSc`;
  return prefix ? `${prefix} ${m[2]}` : m[2];
}
