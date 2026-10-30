import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import type { DisciplineRow } from "@/hooks/useDisciplines";
import { cn } from "@/lib/utils";

export function EditDisciplines() {
  const [rows, setRows] = useState<DisciplineRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newLabel, setNewLabel] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  async function fetchAll() {
    const client = getSupabase();
    if (!client) return;
    setLoading(true);
    const { data } = await client
      .from("vdm_disciplines")
      .select("*")
      .order("position");
    setLoading(false);
    setRows((data ?? []) as DisciplineRow[]);
  }

  useEffect(() => {
    void fetchAll();
  }, []);

  async function add() {
    const label = newLabel.trim();
    if (!label) return;
    const client = getSupabase();
    if (!client) return;
    const nextPos = rows.length
      ? Math.max(...rows.map((r) => r.position)) + 10
      : 10;
    const { error } = await client
      .from("vdm_disciplines")
      .insert({ label, position: nextPos });
    if (error) {
      toast.error("No pudimos agregar", { description: error.message });
      return;
    }
    setNewLabel("");
    void fetchAll();
  }

  async function saveEdit(id: string) {
    const client = getSupabase();
    if (!client) return;
    const { error } = await client
      .from("vdm_disciplines")
      .update({ label: editingValue.trim() })
      .eq("id", id);
    if (error) {
      toast.error("No pudimos guardar", { description: error.message });
      return;
    }
    setEditingId(null);
    void fetchAll();
  }

  async function remove(r: DisciplineRow) {
    if (!confirm(`¿Quitar "${r.label}"?`)) return;
    const client = getSupabase();
    if (!client) return;
    const { error } = await client
      .from("vdm_disciplines")
      .delete()
      .eq("id", r.id);
    if (error) {
      toast.error("No pudimos quitar", { description: error.message });
      return;
    }
    void fetchAll();
  }

  async function move(r: DisciplineRow, dir: "up" | "down") {
    const idx = rows.findIndex((x) => x.id === r.id);
    const other = rows[dir === "up" ? idx - 1 : idx + 1];
    if (!other) return;
    const client = getSupabase();
    if (!client) return;
    await client.from("vdm_disciplines").upsert([
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
      <header>
        <h1 className="font-display text-h2 leading-h2 font-semibold text-ink">
          Disciplinas del equipo
        </h1>
        <p className="mt-2 max-w-xl text-body text-ink-muted">
          Las pastillas azules que aparecen en el apartado Quiénes somos.
        </p>
      </header>

      <ul className="grid gap-2">
        {rows.map((r, i) => (
          <li
            key={r.id}
            className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2"
          >
            {editingId === r.id ? (
              <input
                autoFocus
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void saveEdit(r.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
                className="min-h-9 w-full rounded-md border border-blue bg-surface px-2 text-base"
              />
            ) : (
              <span className="text-base text-ink">{r.label}</span>
            )}
            <div className="flex items-center gap-1">
              {editingId === r.id ? (
                <>
                  <DBtn label="Guardar" onClick={() => saveEdit(r.id)}>
                    <Save className="size-4" aria-hidden="true" />
                  </DBtn>
                  <DBtn label="Cancelar" onClick={() => setEditingId(null)}>
                    <X className="size-4" aria-hidden="true" />
                  </DBtn>
                </>
              ) : (
                <>
                  <DBtn label="Subir" onClick={() => move(r, "up")} disabled={i === 0}>
                    <ArrowUp className="size-4" aria-hidden="true" />
                  </DBtn>
                  <DBtn label="Bajar" onClick={() => move(r, "down")} disabled={i === rows.length - 1}>
                    <ArrowDown className="size-4" aria-hidden="true" />
                  </DBtn>
                  <DBtn
                    label="Editar"
                    onClick={() => {
                      setEditingId(r.id);
                      setEditingValue(r.label);
                    }}
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </DBtn>
                  <DBtn label="Eliminar" tone="danger" onClick={() => remove(r)}>
                    <Trash2 className="size-4" aria-hidden="true" />
                  </DBtn>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 rounded-lg border border-dashed border-line bg-surface p-3">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void add();
            }
          }}
          placeholder="Nueva disciplina…"
          className="min-h-10 flex-1 rounded-md border border-line-strong bg-surface px-3 text-base focus:border-blue focus:outline-focus-ring"
        />
        <Button onClick={add} disabled={!newLabel.trim()}>
          <Plus className="size-4" aria-hidden="true" />
          Agregar
        </Button>
      </div>
    </div>
  );
}

function DBtn({
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
