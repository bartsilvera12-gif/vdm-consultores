import { useEffect, useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import type { ContactInfoRow } from "@/hooks/useContactInfo";
import { cn } from "@/lib/utils";

type Row = Omit<ContactInfoRow, "id">;

const emptyRow: Row = {
  whatsapp_label: "WhatsApp",
  whatsapp_value: "",
  whatsapp_href: "",
  whatsapp_pending: true,
  email_label: "Correo",
  email_value: "",
  email_href: "",
  email_pending: true,
  office_label: "Oficina",
  office_value: "",
  office_pending: true,
  linkedin_label: "LinkedIn",
  linkedin_value: "",
  linkedin_href: "",
  linkedin_pending: true,
  facebook_label: "Facebook",
  facebook_value: "",
  facebook_href: "",
  facebook_pending: true,
  instagram_label: "Instagram",
  instagram_value: "",
  instagram_href: "",
  instagram_pending: true,
};

export function EditContact() {
  const [row, setRow] = useState<Row>(emptyRow);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setLoadError("Supabase no está configurado.");
      setLoading(false);
      return;
    }
    client
      .from("vdm_contact_info")
      .select("*")
      .eq("id", "default")
      .maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error) {
          setLoadError(error.message);
          return;
        }
        if (data) {
          const { id: _id, updated_at: _ua, ...rest } = data as ContactInfoRow & {
            updated_at?: string;
          };
          setRow({ ...emptyRow, ...rest });
        }
      });
  }, []);

  function update<K extends keyof Row>(key: K, value: Row[K]) {
    setRow((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const client = getSupabase();
    if (!client) {
      toast.error("Supabase no está configurado.");
      return;
    }
    setSaving(true);
    const { error } = await client
      .from("vdm_contact_info")
      .upsert({ id: "default", ...row });
    setSaving(false);
    if (error) {
      toast.error("No pudimos guardar", { description: error.message });
      return;
    }
    toast.success("Datos de contacto actualizados");
  }

  if (loading) {
    return (
      <div
        className="grid min-h-48 place-items-center text-small text-ink-muted"
        aria-busy="true"
      >
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-h2 leading-h2 font-semibold text-ink">
          Datos de contacto
        </h1>
        <p className="mt-2 max-w-xl text-body text-ink-muted">
          Lo que guardes acá se muestra en el apartado Contacto y en el footer
          del sitio público. Si un campo queda marcado como “pendiente”,
          aparecerá como “(a confirmar)” para los visitantes.
        </p>
      </header>

      {loadError && (
        <p className="rounded-sm border border-[#B3261E]/40 bg-[#FEEEEC] px-3 py-2 text-small text-[#B3261E]">
          {loadError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6">
        <Fieldset legend="WhatsApp">
          <TextField
            label="Etiqueta"
            value={row.whatsapp_label}
            onChange={(v) => update("whatsapp_label", v)}
          />
          <TextField
            label="Número"
            value={row.whatsapp_value}
            placeholder="+595 981 000 000"
            onChange={(v) => update("whatsapp_value", v)}
          />
          <TextField
            label="Enlace (wa.me)"
            value={row.whatsapp_href ?? ""}
            placeholder="https://wa.me/5959XXXXXXXX"
            onChange={(v) => update("whatsapp_href", v)}
          />
          <PendingSwitch
            value={row.whatsapp_pending}
            onChange={(v) => update("whatsapp_pending", v)}
          />
        </Fieldset>

        <Fieldset legend="Correo">
          <TextField
            label="Etiqueta"
            value={row.email_label}
            onChange={(v) => update("email_label", v)}
          />
          <TextField
            label="Correo visible"
            type="email"
            value={row.email_value}
            placeholder="contacto@vdmconsultores.com.py"
            onChange={(v) => update("email_value", v)}
          />
          <TextField
            label="Enlace (mailto:)"
            value={row.email_href ?? ""}
            placeholder="mailto:contacto@vdmconsultores.com.py"
            onChange={(v) => update("email_href", v)}
          />
          <PendingSwitch
            value={row.email_pending}
            onChange={(v) => update("email_pending", v)}
          />
        </Fieldset>

        <Fieldset legend="Oficina">
          <TextField
            label="Etiqueta"
            value={row.office_label}
            onChange={(v) => update("office_label", v)}
          />
          <TextField
            label="Dirección"
            value={row.office_value}
            placeholder="Av. Mariscal López 1234 · Asunción, Paraguay"
            onChange={(v) => update("office_value", v)}
          />
          <PendingSwitch
            value={row.office_pending}
            onChange={(v) => update("office_pending", v)}
          />
        </Fieldset>

        <Fieldset legend="Facebook">
          <TextField
            label="Etiqueta"
            value={row.facebook_label}
            onChange={(v) => update("facebook_label", v)}
          />
          <TextField
            label="Texto visible"
            value={row.facebook_value}
            placeholder="facebook.com/vdmconsultores.py"
            onChange={(v) => update("facebook_value", v)}
          />
          <TextField
            label="Enlace"
            value={row.facebook_href ?? ""}
            placeholder="https://www.facebook.com/vdmconsultores.py"
            onChange={(v) => update("facebook_href", v)}
          />
          <PendingSwitch
            value={row.facebook_pending}
            onChange={(v) => update("facebook_pending", v)}
          />
        </Fieldset>

        <Fieldset legend="Instagram">
          <TextField
            label="Etiqueta"
            value={row.instagram_label}
            onChange={(v) => update("instagram_label", v)}
          />
          <TextField
            label="Texto visible"
            value={row.instagram_value}
            placeholder="@vdmconsultores"
            onChange={(v) => update("instagram_value", v)}
          />
          <TextField
            label="Enlace"
            value={row.instagram_href ?? ""}
            placeholder="https://www.instagram.com/vdmconsultores/"
            onChange={(v) => update("instagram_href", v)}
          />
          <PendingSwitch
            value={row.instagram_pending}
            onChange={(v) => update("instagram_pending", v)}
          />
        </Fieldset>

        <Fieldset legend="LinkedIn">
          <TextField
            label="Etiqueta"
            value={row.linkedin_label}
            onChange={(v) => update("linkedin_label", v)}
          />
          <TextField
            label="Texto visible"
            value={row.linkedin_value}
            placeholder="LinkedIn de la firma"
            onChange={(v) => update("linkedin_value", v)}
          />
          <TextField
            label="Enlace"
            value={row.linkedin_href ?? ""}
            placeholder="https://www.linkedin.com/company/..."
            onChange={(v) => update("linkedin_href", v)}
          />
          <PendingSwitch
            value={row.linkedin_pending}
            onChange={(v) => update("linkedin_pending", v)}
          />
        </Fieldset>

        <div className="sticky bottom-4 flex items-center justify-end gap-3 rounded-lg border border-line bg-surface p-3 shadow-card">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Guardando…
              </>
            ) : (
              <>
                <Save className="size-4" aria-hidden="true" />
                Guardar cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Fieldset({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:p-6">
      <legend className="px-1 font-display text-eyebrow uppercase tracking-eyebrow text-blue">
        {legend}
      </legend>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-label font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-base text-ink focus:border-blue focus:outline-focus-ring"
      />
    </label>
  );
}

function PendingSwitch({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex items-center justify-between gap-3 rounded-md border border-line bg-surface-alt px-3 py-2 sm:col-span-2",
      )}
    >
      <div>
        <span className="block font-display text-sm font-semibold text-ink">
          Marcar como pendiente
        </span>
        <span className="block text-small text-ink-muted">
          Si está activado, el sitio muestra el campo con “(a confirmar)”.
        </span>
      </div>
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="size-5 accent-blue"
      />
    </label>
  );
}
