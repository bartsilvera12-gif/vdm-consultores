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
  facebook: ContactRow;
  instagram: ContactRow;
};

export const contactInfo: ContactInfo = {
  whatsapp: {
    label: "WhatsApp",
    value: "+595 974 259 049",
    pending: false,
    href: "https://wa.me/595974259049",
  },
  email: {
    label: "Correo",
    value: "asesoria@vdmconsultores.com.py",
    pending: false,
    href: "mailto:asesoria@vdmconsultores.com.py",
  },
  office: {
    label: "Oficina",
    value:
      "Caballero 893 casi Manuel Domínguez, Barrio La Catedral, Asunción",
    pending: false,
  },
  linkedin: {
    label: "LinkedIn",
    value: "Enlace a confirmar",
    pending: true,
    href: "#",
  },
  facebook: {
    label: "Facebook",
    value: "facebook.com/vdmconsultores.py",
    pending: false,
    href: "https://www.facebook.com/vdmconsultores.py",
  },
  instagram: {
    label: "Instagram",
    value: "@vdmconsultores",
    pending: false,
    href: "https://www.instagram.com/vdmconsultores/",
  },
};
