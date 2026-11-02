import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
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
import { getAreaIcon } from "@/hooks/useAreas";
import { IconPicker } from "./IconPicker";
import type { SectorRow } from "@/hooks/useSectors";
import { cn } from "@/lib/utils";

type Draft = {
  id?: string;
  position: number;
  title: string;
  body: string;
  icon: string;
};

const emptyDraft: Draft = {
  position: 0,
  title: "",
  body: "",
  icon: "briefcase",
};

export function EditSectors() {
  const [rows, setRows] = useState<SectorRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);

  async function fetchAll() {
    const client = getSupabase();
    if (!client) return;
    setLoading(true);
    const { data } = await client
      .from("vdm_sectors")
      .select("*")
      .order("position");
    setLoading(false);
    setRows((data ?? []) as SectorRow[]);
  }

  useEffect(() => {
    void fetchAll();
  }, []);

  function startNew() {
    const nextPos = rows.length
      ? Math.max(...rows.map((r) => r.position)) + 10
      : 10;
    setDraft({ ...emptyDraft, position: nextPos });
    setEditingId("new");
  }

  function startEdit(r: SectorRow) {
    setDraft({ ...r });
    setEditingId(r.id);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const client = getSupabase();
    if (!client) return;
    if (!draft.title.trim()) {
      toast.error("El título es obligatorio");
      return;
    }
    setSaving(true);
    const payload = {
      position: draft.position,
      title: draft.title.trim(),
      body: draft.body.trim(),
      icon: draft.icon,
    };
    const q = draft.id
      ? client.from("vdm_sectors").update(payload).eq("id", draft.id)
      : client.from("vdm_sectors").insert(payload);
    const { error } = await q;
    setSaving(false);
    if (error) {
      toast.error("No pudimos guardar", { description: error.message });
      return;
    }
    toast.success(draft.id ? "Tarjeta actualizada" : "Tarjeta creada");
    setEditingId(null);
    void fetchAll();
  }

  async function remove(r: SectorRow) {
    if (!confirm(`¿Eliminar "${r.title}"?`)) return;
    const client = getSupabase();
    if (!client) return;
    const { error } = await client.from("vdm_sectors").delete().eq("id", r.id);
    if (error) {
      toast.error("No pudimos eliminar", { description: error.message });
      return;
    }
    void fetchAll();
  }

  async function move(r: SectorRow, dir: "up" | "down") {
    const idx = rows.findIndex((x) => x.id === r.id);
    const other = rows[dir === "up" ? idx - 1 : idx + 1];
    if (!other) return;
    const client = getSupabase();
    if (!client) return;
    await client.from("vdm_sectors").upsert([
      { ...r, position: other.position },
      { ...other, position: r.position },
    ]);
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
            Experiencia
          </h1>
          <p className="mt-2 max-w-xl text-body text-ink-muted">
            Las tarjetas del apartado "A quiénes acompañamos".
          </p>
        </div>
        <Button onClick={startNew} disabled={editingId === "new"}>
          <Plus className="size-4" aria-hidden="true" />
          Agregar tarjeta
        </Button>
      </header>

      {editingId && (
        <SectorForm
          draft={draft}
          setDraft={setDraft}
          onCancel={() => setEditingId(null)}
          onSubmit={handleSubmit}
          saving={saving}
          isNew={editingId === "new"}
        />
      )}

      <ul className="grid gap-3">
        {rows.map((r, i) => {
          const Icon = getAreaIcon(r.icon);
          return (
            <li
              key={r.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg border border-line bg-surface p-3"
            >
              <span className="grid size-11 place-items-center rounded-md bg-surface-alt text-blue">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-display text-base font-semibold text-ink">
                  {r.title}
                </p>
                <p className="truncate text-small text-ink-muted">{r.body}</p>
              </div>
              <div className="flex items-center gap-1">
                <SBtn label="Subir" onClick={() => move(r, "up")} disabled={i === 0}>
                  <ArrowUp className="size-4" aria-hidden="true" />
                </SBtn>
                <SBtn
                  label="Bajar"
                  onClick={() => move(r, "down")}
                  disabled={i === rows.length - 1}
                >
                  <ArrowDown className="size-4" aria-hidden="true" />
                </SBtn>
                <SBtn label="Editar" onClick={() => startEdit(r)}>
                  <Pencil className="size-4" aria-hidden="true" />
                </SBtn>
                <SBtn label="Eliminar" tone="danger" onClick={() => remove(r)}>
                  <Trash2 className="size-4" aria-hidden="true" />
                </SBtn>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SectorForm({
  draft,
  setDraft,
  onCancel,
  onSubmit,
  saving,
  isNew,
}: {
  draft: Draft;
  setDraft: (d: Draft) => void;
  onCancel: () => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  saving: boolean;
  isNew: boolean;
}) {
  const inputBase =
    "min-h-11 w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-base text-ink focus:border-blue focus:outline-focus-ring";
  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-lg border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-h3 leading-h3 font-semibold">
          {isNew ? "Nueva tarjeta" : "Editar tarjeta"}
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
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-label font-semibold">Título</span>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            required
            className={inputBase}
          />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-label font-semibold">Descripción</span>
          <textarea
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            rows={2}
            className={cn(inputBase, "min-h-20 resize-y")}
          />
        </label>
        <div className="grid gap-1.5 sm:col-span-2">
          <span className="text-label font-semibold">Ícono</span>
          <IconPicker
            value={draft.icon}
            onChange={(icon) => setDraft({ ...draft, icon })}
          />
        </div>
        <label className="grid gap-1.5">
          <span className="text-label font-semibold">Orden</span>
          <input
            type="number"
            value={draft.position}
            onChange={(e) =>
              setDraft({ ...draft, position: Number(e.target.value) || 0 })
            }
            className={inputBase}
          />
        </label>
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
              {isNew ? "Crear" : "Guardar"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function SBtn({
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
