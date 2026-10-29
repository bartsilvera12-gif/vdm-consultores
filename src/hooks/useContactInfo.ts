import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { contactInfo as defaults, type ContactInfo } from "@/content/contact";

/** Shape de la fila en la tabla `contact_info`. */
export type ContactInfoRow = {
  id: string;
  whatsapp_label: string;
  whatsapp_value: string;
  whatsapp_href: string | null;
  whatsapp_pending: boolean;
  email_label: string;
  email_value: string;
  email_href: string | null;
  email_pending: boolean;
  office_label: string;
  office_value: string;
  office_pending: boolean;
  linkedin_label: string;
  linkedin_value: string;
  linkedin_href: string | null;
  linkedin_pending: boolean;
};

function rowToContact(row: ContactInfoRow): ContactInfo {
  return {
    whatsapp: {
      label: row.whatsapp_label,
      value: row.whatsapp_value,
      pending: row.whatsapp_pending,
      href: row.whatsapp_href ?? "#",
    },
    email: {
      label: row.email_label,
      value: row.email_value,
      pending: row.email_pending,
      href: row.email_href ?? "#",
    },
    office: {
      label: row.office_label,
      value: row.office_value,
      pending: row.office_pending,
    },
    linkedin: {
      label: row.linkedin_label,
      value: row.linkedin_value,
      pending: row.linkedin_pending,
      href: row.linkedin_href ?? "#",
    },
  };
}

/**
 * Lee la fila singleton `contact_info`. Si Supabase no está configurado o la
 * tabla todavía no existe, cae a los defaults de src/content/contact.ts para
 * que el sitio nunca se rompa.
 */
export function useContactInfo(): ContactInfo {
  const [info, setInfo] = useState<ContactInfo>(defaults);

  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    let cancelled = false;
    client
      .from("contact_info")
      .select("*")
      .eq("id", "default")
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled || error || !data) return;
        setInfo(rowToContact(data as ContactInfoRow));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return info;
}
