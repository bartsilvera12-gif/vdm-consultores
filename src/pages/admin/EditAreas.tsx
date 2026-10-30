import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import {
  AREA_ICONS,
  getAreaIcon,
  type AreaRow,
  type AreaServiceRow,
} from "@/hooks/useAreas";
import { cn } from "@/lib/utils";

type DraftArea = {
  id?: string;
  slug: string;
  position: number;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  icon: string;
};

const emptyArea: DraftArea = {
  slug: "",
  position: 0,
  eyebrow: "",
  title: "",
  description: "",
  summary: "",
  icon: "briefcase",
};

/** Normaliza un texto a slug (sin acentos, kebab-case, solo [a-z0-9-]). */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // acentos
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

/**
 * Catálogo de íconos visibles con su nombre amigable en español.
 * El `name` es la clave que se guarda en DB; la etiqueta es solo UI.
 */
const ICON_OPTIONS: Array<{ name: string; label: string }> = [
  { name: "scale", label: "Balanza" },
  { name: "trending-up", label: "Crecimiento" },
  { name: "globe", label: "Globo" },
  { name: "factory", label: "Fábrica" },
  { name: "briefcase", label: "Maletín" },
  { name: "building", label: "Edificio" },
  { name: "leaf", label: "Hoja" },
  { name: "key", label: "Llave" },
];

export function EditAreas() {
  const [areas, setAreas] = useState<AreaRow[]>([]);
  const [servicesByArea, setServicesByArea] = useState<
    Record<string, AreaServiceRow[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<DraftArea>(emptyArea);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function fetchAll() {
    const client = getSupabase();
    if (!client) return;
    setLoading(true);
    const [areasRes, servicesRes] = await Promise.all([
      client.from("vdm_areas").select("*").order("position"),
      client.from("vdm_area_services").select("*").order("position"),
    ]);
    setLoading(false);
    if (areasRes.data) setAreas(areasRes.data as AreaRow[]);
    if (servicesRes.data) {
      const map: Record<string, AreaServiceRow[]> = {};
      for (const row of servicesRes.data as AreaServiceRow[]) {
        (map[row.area_id] ??= []).push(row);
      }
      setServicesByArea(map);
    }
  }

  useEffect(() => {
    void fetchAll();
  }, []);

  function startNew() {
    const nextPos = areas.length
      ? Math.max(...areas.map((a) => a.position)) + 10
      : 10;
    setDraft({ ...emptyArea, position: nextPos });
    setEditingId("new");
  }

  function startEdit(a: AreaRow) {
    setDraft({ ...a });
    setEditingId(a.id);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const client = getSupabase();
    if (!client) return;
    if (!draft.eyebrow.trim() || !draft.title.trim()) {
      toast.error("Título breve y título largo son obligatorios");
      return;
    }
    setSaving(true);
    // Slug: en nuevas áreas lo generamos del eyebrow (nunca se muestra al
    // usuario); al editar, mantenemos el que ya tenía (es la clave de los
    // links internos como /servicios#juridico y no debería moverse).
    const slug = draft.id
      ? draft.slug.trim()
      : slugify(draft.eyebrow);
    const payload = {
      slug,
      position: draft.position,
      eyebrow: draft.eyebrow.trim(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      summary: draft.summary.trim(),
      icon: draft.icon,
    };
    const q = draft.id
      ? client.from("vdm_areas").update(payload).eq("id", draft.id)
      : client.from("vdm_areas").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) {
      toast.error("No pudimos guardar", { description: error.message });
      return;
    }
    toast.success(draft.id ? "Área actualizada" : "Área creada");
    setEditingId(null);
    void fetchAll();
  }

  async function handleDelete(area: AreaRow) {
    if (
      !confirm(
        `¿Eliminar el área "${area.eyebrow}"?\nTambién se van a eliminar sus servicios internos. Esto no se puede deshacer.`,
      )
    )
      return;
    const client = getSupabase();
    if (!client) return;
    const { error } = await client
      .from("vdm_areas")
      .delete()
      .eq("id", area.id);
    if (error) {
      toast.error("No pudimos eliminar", { description: error.message });
      return;
    }
    toast.success("Área eliminada");
    void fetchAll();
  }

  async function move(area: AreaRow, dir: "up" | "down") {
    const idx = areas.findIndex((a) => a.id === area.id);
    const otherIdx = dir === "up" ? idx - 1 : idx + 1;
    if (otherIdx < 0 || otherIdx >= areas.length) return;
    const other = areas[otherIdx];
    const client = getSupabase();
    if (!client) return;
    const { error } = await client.from("vdm_areas").upsert([
      { ...area, position: other.position },
      { ...other, position: area.position },
    ]);
    if (error) {
      toast.error("No pudimos reordenar", { description: error.message });
      return;
    }
    void fetchAll();
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
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 leading-h2 font-semibold text-ink">
            Áreas de servicio
          </h1>
          <p className="mt-2 max-w-xl text-body text-ink-muted">
            Las 4 áreas que aparecen en el apartado Servicios. Podés agregar,
            editar, reordenar y gestionar la lista de servicios de cada una.
          </p>
        </div>
        <Button onClick={startNew} disabled={editingId === "new"}>
          <Plus className="size-4" aria-hidden="true" />
          Agregar área
        </Button>
      </header>

      {editingId && (
        <AreaForm
          draft={draft}
          setDraft={setDraft}
          onCancel={() => setEditingId(null)}
          onSubmit={handleSubmit}
          saving={saving}
          isNew={editingId === "new"}
        />
      )}

      <ul className="grid gap-3">
        {areas.map((area, i) => {
          const Icon = getAreaIcon(area.icon);
          const expanded = expandedId === area.id;
          return (
            <li
              key={area.id}
              className="rounded-lg border border-line bg-surface"
            >
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3">
                <span className="grid size-11 place-items-center rounded-md bg-surface-alt text-blue">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-ink">
                    {area.eyebrow}
                  </p>
                  <p className="truncate text-small text-ink-muted">
                    {area.summary || area.title}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <IconBtn
                    label="Subir"
                    onClick={() => move(area, "up")}
                    disabled={i === 0}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </IconBtn>
                  <IconBtn
                    label="Bajar"
                    onClick={() => move(area, "down")}
                    disabled={i === areas.length - 1}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </IconBtn>
                  <IconBtn
                    label={expanded ? "Ocultar servicios" : "Ver servicios"}
                    onClick={() =>
                      setExpandedId(expanded ? null : area.id)
                    }
                  >
                    <ChevronDown
                      className={cn(
                        "size-4 transition-transform",
                        expanded && "rotate-180",
                      )}
                      aria-hidden="true"
                    />
                  </IconBtn>
                  <IconBtn label="Editar" onClick={() => startEdit(area)}>
                    <Pencil className="size-4" aria-hidden="true" />
                  </IconBtn>
                  <IconBtn
                    label="Eliminar"
                    tone="danger"
                    onClick={() => handleDelete(area)}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </IconBtn>
                </div>
              </div>
              {expanded && (
                <ServicesEditor
                  areaId={area.id}
                  services={servicesByArea[area.id] ?? []}
                  onChange={fetchAll}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// -----------------------------------------------------------------------
// Form del área
// -----------------------------------------------------------------------
function AreaForm({
  draft,
  setDraft,
  onCancel,
  onSubmit,
  saving,
  isNew,
}: {
  draft: DraftArea;
  setDraft: (d: DraftArea) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  isNew: boolean;
}) {
  const inputBase =
    "min-h-11 w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-base text-ink focus:border-blue focus:outline-focus-ring";
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h3 leading-h3 font-semibold">
          {isNew ? "Nueva área" : "Editar área"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex size-9 items-center justify-center rounded-md border border-line text-ink"
          aria-label="Cerrar"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <L label="Título breve" hint="Como 'Estudio Jurídico'" className="sm:col-span-2">
          <input
            value={draft.eyebrow}
            onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
            placeholder="Estudio Jurídico"
            required
            className={inputBase}
          />
        </L>
        <L label="Título largo" className="sm:col-span-2">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="La seguridad jurídica que tu empresa necesita"
            required
            className={inputBase}
          />
        </L>
        <L label="Descripción" className="sm:col-span-2">
          <textarea
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            rows={2}
            className={cn(inputBase, "min-h-20 resize-y")}
          />
        </L>
        <L label="Resumen" hint="Aparece en el panel navy del inicio" className="sm:col-span-2">
          <input
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            placeholder="Civil, comercial, laboral, administrativo"
            className={inputBase}
          />
        </L>
        <div className="grid gap-1.5 sm:col-span-2">
          <span className="text-label font-semibold">Ícono</span>
          <IconPicker value={draft.icon} onChange={(icon) => setDraft({ ...draft, icon })} />
        </div>
        <L label="Orden" hint="Menor = aparece antes">
          <input
            type="number"
            value={draft.position}
            onChange={(e) =>
              setDraft({ ...draft, position: Number(e.target.value) || 0 })
            }
            className={inputBase}
          />
        </L>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Guardando…
            </>
          ) : (
            <>
              <Save className="size-4" aria-hidden="true" />
              {isNew ? "Crear área" : "Guardar"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// -----------------------------------------------------------------------
// Editor de servicios dentro de un área (inline)
// -----------------------------------------------------------------------
function ServicesEditor({
  areaId,
  services,
  onChange,
}: {
  areaId: string;
  services: AreaServiceRow[];
  onChange: () => Promise<void>;
}) {
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  async function add() {
    const label = newLabel.trim();
    if (!label) return;
    const client = getSupabase();
    if (!client) return;
    setAdding(true);
    const nextPos = services.length
      ? Math.max(...services.map((s) => s.position)) + 10
      : 10;
    const { error } = await client
      .from("vdm_area_services")
      .insert({ area_id: areaId, label, position: nextPos });
    setAdding(false);
    if (error) {
      toast.error("No pudimos agregar", { description: error.message });
      return;
    }
    setNewLabel("");
    await onChange();
  }

  async function saveEdit(id: string) {
    const client = getSupabase();
    if (!client) return;
    const { error } = await client
      .from("vdm_area_services")
      .update({ label: editingValue.trim() })
      .eq("id", id);
    if (error) {
      toast.error("No pudimos guardar", { description: error.message });
      return;
    }
    setEditingId(null);
    await onChange();
  }

  async function remove(id: string) {
    if (!confirm("¿Quitar este servicio?")) return;
    const client = getSupabase();
    if (!client) return;
    const { error } = await client
      .from("vdm_area_services")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("No pudimos quitar", { description: error.message });
      return;
    }
    await onChange();
  }

  async function moveService(s: AreaServiceRow, dir: "up" | "down") {
    const idx = services.findIndex((x) => x.id === s.id);
    const other = services[dir === "up" ? idx - 1 : idx + 1];
    if (!other) return;
    const client = getSupabase();
    if (!client) return;
    await client.from("vdm_area_services").upsert([
      { ...s, position: other.position },
      { ...other, position: s.position },
    ]);
    await onChange();
  }

  return (
    <div className="border-t border-line bg-surface-alt p-4">
      <p className="mb-3 font-display text-eyebrow uppercase tracking-eyebrow text-ink-muted">
        Servicios ({services.length})
      </p>
      <ul className="grid gap-2">
        {services.map((s, i) => (
          <li
            key={s.id}
            className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-md border border-line bg-surface px-3 py-2"
          >
            {editingId === s.id ? (
              <input
                autoFocus
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void saveEdit(s.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="min-h-9 w-full rounded-md border border-blue bg-surface px-2 text-base"
              />
            ) : (
              <span className="truncate text-base text-ink">{s.label}</span>
            )}
            <div className="flex items-center gap-1">
              {editingId === s.id ? (
                <>
                  <IconBtn label="Guardar" onClick={() => saveEdit(s.id)}>
                    <Save className="size-4" aria-hidden="true" />
                  </IconBtn>
                  <IconBtn label="Cancelar" onClick={() => setEditingId(null)}>
                    <X className="size-4" aria-hidden="true" />
                  </IconBtn>
                </>
              ) : (
                <>
                  <IconBtn
                    label="Subir"
                    onClick={() => moveService(s, "up")}
                    disabled={i === 0}
                  >
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </IconBtn>
                  <IconBtn
                    label="Bajar"
                    onClick={() => moveService(s, "down")}
                    disabled={i === services.length - 1}
                  >
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </IconBtn>
                  <IconBtn
                    label="Editar"
                    onClick={() => {
                      setEditingId(s.id);
                      setEditingValue(s.label);
                    }}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </IconBtn>
                  <IconBtn label="Eliminar" tone="danger" onClick={() => remove(s.id)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </IconBtn>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void add();
            }
          }}
          placeholder="Agregar servicio…"
          className="min-h-10 flex-1 rounded-md border border-line-strong bg-surface px-3 text-base focus:border-blue focus:outline-focus-ring"
        />
        <Button type="button" size="sm" onClick={add} disabled={adding || !newLabel.trim()}>
          <Plus className="size-4" aria-hidden="true" />
          Agregar
        </Button>
      </div>
    </div>
  );
}

function L({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("grid gap-1.5", className)}>
      <span className="text-label font-semibold">
        {label}
        {hint && (
          <span className="ml-1 font-normal text-ink-muted">({hint})</span>
        )}
      </span>
      {children}
    </label>
  );
}

// -----------------------------------------------------------------------
// Grilla visual para elegir ícono
// -----------------------------------------------------------------------
function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {ICON_OPTIONS.map((opt) => {
        const Icon = getAreaIcon(opt.name);
        const selected = value === opt.name;
        return (
          <button
            key={opt.name}
            type="button"
            onClick={() => onChange(opt.name)}
            title={opt.label}
            className={cn(
              "grid aspect-square place-items-center rounded-md border transition-all",
              selected
                ? "border-blue bg-blue text-white shadow-card"
                : "border-line bg-surface text-ink-muted hover:border-blue hover:text-blue",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="sr-only">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-md border transition-colors disabled:pointer-events-none disabled:opacity-40",
        tone === "danger"
          ? "border-line text-ink-muted hover:border-[#B3261E] hover:text-[#B3261E]"
          : "border-line text-ink-muted hover:border-blue hover:text-blue",
      )}
    >
      {children}
    </button>
  );
}
