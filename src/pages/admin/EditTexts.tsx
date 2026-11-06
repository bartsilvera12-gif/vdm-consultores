import { useEffect, useState, type FormEvent } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import {
  defaultFor,
  storageKey,
  type SiteContentKey,
} from "@/hooks/useSiteContent";
import { LANGS, LANG_NAMES, type Lang } from "@/i18n/langs";
import { cn } from "@/lib/utils";

function defaultsFor(lang: Lang) {
  const out = {} as Record<SiteContentKey, string>;
  for (const k of ALL_KEYS) out[k] = defaultFor(k, lang);
  return out;
}

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
    title: "Inicio · Portada",
    items: [
      { key: "inicio.title", label: "Titular", hint: "Título grande sobre el fondo azul.", rows: 2 },
      { key: "inicio.lead", label: "Párrafo bajo el titular", hint: "", rows: 3 },
      { key: "inicio.button", label: "Texto del botón", hint: "Lleva a Servicios.", rows: 1 },
      { key: "inicio.band_button", label: "Botón de la franja azul", hint: "Franja al final del inicio, lleva a Contacto.", rows: 1 },
    ],
  },
  {
    title: "Quiénes somos",
    items: [
      { key: "hero.lead", label: "Párrafo bajo “Fortaleciendo empresas”", hint: "Junto a la foto del equipo reunido.", rows: 5 },
      { key: "about.commitment", label: "Compromiso", hint: "Párrafo sobre el compromiso de VDM.", rows: 6 },
    ],
  },
  {
    title: "Servicios",
    items: [
      { key: "servicios.hero_title", label: "Título", hint: "", rows: 2 },
      { key: "servicios.hero_lead", label: "Párrafo", hint: "", rows: 3 },
    ],
  },
  {
    title: "Equipo",
    items: [
      { key: "equipo.hero_title", label: "Título", hint: "", rows: 2 },
      { key: "equipo.hero_lead", label: "Párrafo", hint: "", rows: 3 },
    ],
  },
  {
    title: "Experiencia",
    items: [
      { key: "experiencia.hero_title", label: "Título", hint: "", rows: 2 },
      { key: "experiencia.hero_lead", label: "Párrafo", hint: "", rows: 3 },
    ],
  },
  {
    title: "Galería",
    items: [{ key: "galeria.hero_title", label: "Título", hint: "", rows: 2 }],
  },
  {
    title: "Contacto",
    items: [
      { key: "contacto.title", label: "Título", hint: "", rows: 2 },
      { key: "contacto.lead", label: "Subtítulo", hint: "", rows: 2 },
    ],
  },
  {
    title: "Cierre de cada página",
    items: [
      { key: "cierre.title", label: "Frase", hint: "Franja azul al final de Quiénes somos, Servicios, Equipo, Experiencia y Galería.", rows: 2 },
      { key: "cierre.button", label: "Texto del botón", hint: "Lleva a Contacto.", rows: 1 },
    ],
  },
];

const ALL_KEYS = GROUPS.flatMap((g) => g.items.map((i) => i.key));

export function EditTexts() {
  const [lang, setLang] = useState<Lang>("es");
  const [values, setValues] = useState<Record<SiteContentKey, string>>(() => defaultsFor("es"));
  const [original, setOriginal] = useState<Record<SiteContentKey, string>>(() => defaultsFor("es"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const client = getSupabase();
    setLoading(true);
    if (!client) {
      setLoading(false);
      return;
    }
    client
      .from("vdm_site_content")
      .select("key, value")
      .in("key", ALL_KEYS.map((k) => storageKey(k, lang)))
      .then(({ data }) => {
        setLoading(false);
        const next = defaultsFor(lang);
        for (const row of (data ?? []) as Array<{ key: string; value: unknown }>) {
          const k = ALL_KEYS.find((key) => storageKey(key, lang) === row.key);
          if (!k) continue;
          const text = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
          if (text.trim()) next[k] = text;
        }
        setValues(next);
        setOriginal(next);
      });
  }, [lang]);

  function changeLang(next: Lang) {
    if (next === lang) return;
    const dirty = ALL_KEYS.some((k) => values[k] !== original[k]);
    if (dirty && !window.confirm("Hay cambios sin guardar en este idioma. ¿Cambiar igual?")) return;
    setLang(next);
  }

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
    const rows = dirty.map((k) => ({ key: storageKey(k, lang), value: values[k] }));
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
        <div role="tablist" aria-label="Idioma" className="mt-4 inline-flex rounded-md border border-line bg-surface p-1">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={l === lang}
              onClick={() => changeLang(l)}
              className={cn(
                "rounded px-3.5 py-1.5 text-small font-semibold transition-colors",
                l === lang ? "bg-blue text-on-blue" : "text-ink-muted hover:text-ink",
              )}
            >
              {LANG_NAMES[l]}
            </button>
          ))}
        </div>
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
                        setValues((p) => ({ ...p, [t.key]: defaultFor(t.key, lang) }))
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
