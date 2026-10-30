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

type Group = {
  title: string;
  items: EditableText[];
};

const GROUPS: Group[] = [
  {
    title: "Inicio · Hero",
    items: [
      { key: "hero.eyebrow", label: "Eyebrow (línea sobre el titular)", hint: "Aparece arriba del título grande, en mayúsculas.", rows: 1 },
      { key: "hero.title_main", label: "Titular principal", hint: "Primera parte del título grande.", rows: 2 },
      { key: "hero.title_em", label: "Titular en azul", hint: "Segunda parte del título grande, se resalta en color.", rows: 2 },
      { key: "hero.lead", label: "Párrafo bajo el título", hint: "Resumen de la firma en 2–3 líneas.", rows: 5 },
      { key: "hero.panel_eyebrow", label: "Panel de áreas · Eyebrow", hint: "Encabezado del panel navy a la derecha.", rows: 1 },
      { key: "hero.panel_title", label: "Panel de áreas · Título", hint: "Título del panel navy a la derecha.", rows: 2 },
    ],
  },
  {
    title: "Banda CTA (Inicio)",
    items: [
      { key: "cta.title", label: "Titular", hint: "Banda azul grande de llamado a la acción.", rows: 2 },
      { key: "cta.body", label: "Párrafo", hint: "Descripción corta debajo del titular.", rows: 3 },
      { key: "cta.button", label: "Texto del botón", hint: "", rows: 1 },
    ],
  },
  {
    title: "Quiénes somos",
    items: [
      { key: "about.title", label: "Título", hint: "", rows: 2 },
      { key: "about.intro", label: "Intro", hint: "Primer párrafo descriptivo.", rows: 5 },
      { key: "about.commitment", label: "Compromiso", hint: "Párrafo de cierre sobre el compromiso de VDM.", rows: 6 },
      { key: "about.slogan", label: "Slogan", hint: "Frase corta inspiracional (sin comillas).", rows: 1 },
    ],
  },
  {
    title: "Apartado Servicios",
    items: [
      { key: "servicios.title", label: "Título", hint: "", rows: 2 },
      { key: "servicios.lead", label: "Párrafo descriptivo", hint: "", rows: 3 },
    ],
  },
  {
    title: "Apartado Experiencia",
    items: [
      { key: "experiencia.title", label: "Título", hint: "", rows: 2 },
      { key: "experiencia.lead", label: "Párrafo descriptivo", hint: "", rows: 3 },
    ],
  },
  {
    title: "Apartado Equipo",
    items: [
      { key: "equipo.title", label: "Título", hint: "", rows: 2 },
      { key: "equipo.lead", label: "Párrafo descriptivo", hint: "", rows: 3 },
    ],
  },
  {
    title: "Apartado Contacto",
    items: [
      { key: "contacto.title", label: "Título del PageHero", hint: "", rows: 2 },
      { key: "contacto.lead", label: "Subtítulo del PageHero", hint: "", rows: 2 },
    ],
  },
];

const ALL_KEYS = GROUPS.flatMap((g) => g.items.map((i) => i.key));

export function EditTexts() {
  const [values, setValues] = useState<Record<SiteContentKey, string>>(() => ({
    ...siteContentDefaults,
  }));
  const [original, setOriginal] = useState<Record<SiteContentKey, string>>(() => ({
    ...siteContentDefaults,
  }));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }
    client
      .from("vdm_site_content")
      .select("key, value")
      .in("key", ALL_KEYS)
      .then(({ data }) => {
        setLoading(false);
        if (!data) return;
        const next = { ...siteContentDefaults };
        for (const row of data as Array<{ key: string; value: unknown }>) {
          if ((ALL_KEYS as string[]).includes(row.key)) {
            next[row.key as SiteContentKey] =
              typeof row.value === "string"
                ? row.value
                : JSON.stringify(row.value);
          }
        }
        setValues(next);
        setOriginal(next);
      });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const client = getSupabase();
    if (!client) {
      toast.error("Supabase no está configurado.");
      return;
    }
    const dirty = ALL_KEYS.filter((k) => values[k] !== original[k]);
    if (dirty.length === 0) {
      toast.message("Sin cambios para guardar");
      return;
    }
    setSaving(true);
    const rows = dirty.map((k) => ({ key: k, value: values[k] }));
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
      <div className="grid min-h-48 place-items-center" aria-busy="true">
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

      <form onSubmit={handleSubmit} className="grid gap-5">
        {GROUPS.map((group) => (
          <section
            key={group.title}
            className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:p-6"
          >
            <h2 className="font-display text-eyebrow uppercase tracking-eyebrow text-blue">
              {group.title}
            </h2>
            <div className="grid gap-4">
              {group.items.map((t) => (
                <div key={t.key} className="grid gap-1.5">
                  <label className="flex items-start justify-between gap-2">
                    <span className="text-label font-semibold">{t.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setValues((p) => ({ ...p, [t.key]: siteContentDefaults[t.key] }))
                      }
                      className="inline-flex items-center gap-1 text-small font-semibold text-blue hover:underline"
                      title="Volver al texto original"
                    >
                      <RotateCcw className="size-3.5" aria-hidden="true" />
                      Original
                    </button>
                  </label>
                  {t.hint && <p className="text-small text-ink-muted">{t.hint}</p>}
                  {t.rows > 1 ? (
                    <textarea
                      value={values[t.key]}
                      onChange={(e) =>
                        setValues((p) => ({ ...p, [t.key]: e.target.value }))
                      }
                      rows={t.rows}
                      className="w-full resize-y rounded-md border border-line-strong bg-surface p-3 text-base text-ink focus:border-blue focus:outline-focus-ring"
                    />
                  ) : (
                    <input
                      value={values[t.key]}
                      onChange={(e) =>
                        setValues((p) => ({ ...p, [t.key]: e.target.value }))
                      }
                      className="min-h-11 rounded-md border border-line-strong bg-surface px-3 text-base text-ink focus:border-blue focus:outline-focus-ring"
                    />
                  )}
                </div>
              ))}
            </div>
          </section>
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
