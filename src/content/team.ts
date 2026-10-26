export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
};

/**
 * Placeholders — reemplazar con los datos y fotos autorizados que entregue VDM.
 * Ver docs/pendientes.md.
 */
export const team: TeamMember[] = [
  { name: "Nombre y apellido", role: "Socio · Estudio Jurídico" },
  { name: "Nombre y apellido", role: "Consultoría Empresarial" },
  { name: "Nombre y apellido", role: "Asesoría en Inversiones" },
  { name: "Nombre y apellido", role: "Habilitaciones" },
];
