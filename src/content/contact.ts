/**
 * Datos de contacto — defaults usados como fallback cuando Supabase no está
 * configurado o la tabla `contact_info` no responde. En producción los valores
 * los edita VDM desde el admin (/admin/contacto).
 */
export type ContactRow = {
  label: string;
  value: string;
  pending?: boolean;
  href?: string;
};

export type ContactInfo = {
  whatsapp: ContactRow;
  email: ContactRow;
  office: ContactRow;
  linkedin: ContactRow;
};

export const contactInfo: ContactInfo = {
  whatsapp: {
    label: "WhatsApp",
    value: "+595 9XX XXX XXX",
    pending: true,
    href: "https://wa.me/595000000000",
  },
  email: {
    label: "Correo",
    value: "contacto@dominio",
    pending: true,
    href: "mailto:contacto@dominio",
  },
  office: {
    label: "Oficina",
    value: "Dirección a confirmar · Paraguay",
    pending: true,
  },
  linkedin: {
    label: "LinkedIn y redes",
    value: "Enlaces a confirmar",
    pending: true,
    href: "#",
  },
};
