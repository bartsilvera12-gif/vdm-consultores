import { useEffect, useState, type FormEvent } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import {
  siteContentDefaults,
  type SiteContentKey,
} from "@/hooks/useSiteContent";

type EditableText = {
  key: SiteContentKey;
  label: string;
  hint: string;
  rows: number;
};

const TEXTS: EditableText[] = [
  {
    key: "hero.lead",
    label: "Hero — párrafo bajo el título",
    hint: "Aparece en la portada (Inicio), debajo del titular grande.",
    rows: 5,
  },
  {
    key: "about.intro",
    label: "Quiénes somos — intro",
    hint: 'Primer párrafo del apartado "Quiénes somos". El tono manda el resto del texto.',
    rows: 5,
  },
  {
    key: "about.commitment",
    label: "Quiénes somos — compromiso",
    hint: 'Párrafo de cierre del apartado "Quiénes somos" (sobre el compromiso de VDM).',
    rows: 6,
  },
];

export function EditTexts() {
  const [values, setValues] = useState<Record<SiteContentKey, string>>(
    { ...siteContentDefaults },
  );
  const [original, setOriginal] = useState<Record<SiteContentKey, string>>(
    { ...siteContentDefaults },
  );
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
      .from("vdm_site_content")
      .select("key, value")
      .in(
        "key",
        TEXTS.map((t) => t.key),
      )
      .then(({ data, error }) => {
        setLoading(false);
        if (error) {
          setLoadError(error.message);
          return;
        }
        if (!data) return;
        const next = { ...values };
        for (const row of data as Array<{ key: string; value: unknown }>) {
          if ((TEXTS.map((t) => t.key) as string[]).includes(row.key)) {
            next[row.key as SiteContentKey] =
              typeof row.value === "string"
                ? row.value
                : JSON.stringify(row.value);
          }
        }
        setValues(next);
        setOriginal(next);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function reset(key: SiteContentKey) {
    setValues((prev) => ({ ...prev, [key]: siteContentDefaults[key] }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const client = getSupabase();
    if (!client) {
      toast.error("Supabase no está configurado.");
      return;
    }
    const dirty = TEXTS.filter((t) => values[t.key] !== original[t.key]);
    if (dirty.length === 0) {
      toast.message("Sin cambios para guardar");
      return;
    }
    setSaving(true);
    // Guardamos valores como JSON (jsonb). Nuestros textos son strings
    // escapados, así que mandamos `JSON.stringify(string)` por fila.
    const rows = dirty.map((t) => ({
      key: t.key,
      value: values[t.key],
    }));
    const { error } = await client.from("vdm_site_content").upsert(rows);
    setSaving(false);
    if (error) {
      toast.error("No pudimos guardar", { description: error.message });
      return;
    }
    setOriginal({ ...values });
    toast.success(
      dirty.length === 1
        ? "Texto actualizado"
        : `${dirty.length} textos actualizados`,
    );
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
          Textos de secciones
        </h1>
        <p className="mt-2 max-w-xl text-body text-ink-muted">
          Editá los copys principales del sitio. Los cambios se publican sin
          redeploy en el apartado correspondiente.
        </p>
      </header>

      {loadError && (
        <p className="rounded-sm border border-[#B3261E]/40 bg-[#FEEEEC] px-3 py-2 text-small text-[#B3261E]">
          {loadError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5">
        {TEXTS.map((t) => (
          <fieldset
            key={t.key}
            className="grid gap-2 rounded-lg border border-line bg-surface p-5 sm:p-6"
          >
            <legend className="px-1 font-display text-eyebrow uppercase tracking-eyebrow text-blue">
              {t.label}
            </legend>
            <p className="text-small text-ink-muted">{t.hint}</p>
            <textarea
              value={values[t.key]}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [t.key]: e.target.value }))
              }
              rows={t.rows}
              className="min-h-24 w-full resize-y rounded-md border border-line-strong bg-surface p-3 text-base text-ink focus:border-blue focus:outline-focus-ring"
            />
            <div className="flex items-center justify-between gap-2 text-small text-ink-muted">
              <span>{values[t.key].length} caracteres</span>
              <button
                type="button"
                onClick={() => reset(t.key)}
                className="inline-flex items-center gap-1 font-semibold text-blue hover:underline"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Volver al texto original
              </button>
            </div>
          </fieldset>
        ))}

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
