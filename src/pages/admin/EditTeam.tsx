import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import type { TeamMemberRow } from "@/hooks/useTeam";
import { cn } from "@/lib/utils";

type DraftMember = {
  id?: string;
  name: string;
  role: string;
  photo_url: string;
  position: number;
};

const emptyDraft: DraftMember = {
  name: "",
  role: "",
  photo_url: "",
  position: 0,
};

export function EditTeam() {
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<DraftMember>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchAll() {
    const client = getSupabase();
    if (!client) {
      setLoadError("Supabase no está configurado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await client
      .from("vdm_team_members")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    setLoading(false);
    if (error) {
      setLoadError(error.message);
      return;
    }
    setLoadError(null);
    setMembers((data ?? []) as TeamMemberRow[]);
  }

  useEffect(() => {
    void fetchAll();
  }, []);

  function startNew() {
    const nextPos = members.length
      ? Math.max(...members.map((m) => m.position)) + 10
      : 10;
    setDraft({ ...emptyDraft, position: nextPos });
    setEditingId("new");
  }

  function startEdit(m: TeamMemberRow) {
    setDraft({
      id: m.id,
      name: m.name,
      role: m.role,
      photo_url: m.photo_url ?? "",
      position: m.position,
    });
    setEditingId(m.id);
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft(emptyDraft);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const client = getSupabase();
    if (!client) return;
    if (draft.name.trim().length < 1 || draft.role.trim().length < 1) {
      toast.error("Nombre y rol son obligatorios");
      return;
    }
    setSaving(true);
    const payload = {
      name: draft.name.trim(),
      role: draft.role.trim(),
      photo_url: draft.photo_url.trim() || null,
      position: draft.position,
    };
    const query = draft.id
      ? client.from("vdm_team_members").update(payload).eq("id", draft.id)
      : client.from("vdm_team_members").insert(payload);
    const { error } = await query;
    setSaving(false);
    if (error) {
      toast.error("No pudimos guardar", { description: error.message });
      return;
    }
    toast.success(draft.id ? "Perfil actualizado" : "Perfil agregado");
    cancelEdit();
    void fetchAll();
  }

  async function handleDelete(member: TeamMemberRow) {
    if (
      !confirm(
        `¿Eliminar a "${member.name}" (${member.role}) del equipo?\nEsta acción no se puede deshacer.`,
      )
    )
      return;
    const client = getSupabase();
    if (!client) return;
    setDeletingId(member.id);
    const { error } = await client
      .from("vdm_team_members")
      .delete()
      .eq("id", member.id);
    setDeletingId(null);
    if (error) {
      toast.error("No pudimos eliminar", { description: error.message });
      return;
    }
    toast.success("Perfil eliminado");
    void fetchAll();
  }

  async function move(member: TeamMemberRow, direction: "up" | "down") {
    const idx = members.findIndex((m) => m.id === member.id);
    const otherIdx = direction === "up" ? idx - 1 : idx + 1;
    if (otherIdx < 0 || otherIdx >= members.length) return;
    const other = members[otherIdx];
    const client = getSupabase();
    if (!client) return;
    // Intercambio simple de la columna position entre los dos vecinos.
    const { error } = await client
      .from("vdm_team_members")
      .upsert([
        { ...member, position: other.position },
        { ...other, position: member.position },
      ]);
    if (error) {
      toast.error("No pudimos reordenar", { description: error.message });
      return;
    }
    void fetchAll();
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
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 leading-h2 font-semibold text-ink">
            Equipo
          </h1>
          <p className="mt-2 max-w-xl text-body text-ink-muted">
            Agregá, editá o reordená los perfiles del equipo. Los cambios se
            publican en el apartado Equipo del sitio sin redeploy.
          </p>
        </div>
        <Button onClick={startNew} disabled={editingId === "new"}>
          <Plus className="size-4" aria-hidden="true" />
          Agregar perfil
        </Button>
      </header>

      {loadError && (
        <p className="rounded-sm border border-[#B3261E]/40 bg-[#FEEEEC] px-3 py-2 text-small text-[#B3261E]">
          {loadError}
        </p>
      )}

      {editingId && (
        <MemberForm
          draft={draft}
          setDraft={setDraft}
          onCancel={cancelEdit}
          onSubmit={handleSubmit}
          saving={saving}
          isNew={editingId === "new"}
        />
      )}

      <ul className="grid gap-3">
        {members.length === 0 && !editingId && (
          <li className="rounded-lg border border-dashed border-line bg-surface p-6 text-center text-small text-ink-muted">
            Todavía no hay perfiles. Agregá el primero con el botón de arriba.
          </li>
        )}
        {members.map((m, i) => (
          <li
            key={m.id}
            className={cn(
              "grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-lg border border-line bg-surface p-3",
              editingId === m.id && "border-blue ring-1 ring-blue",
            )}
          >
            <div className="grid size-14 place-items-center overflow-hidden rounded-md bg-surface-alt">
              {m.photo_url ? (
                <img
                  src={m.photo_url}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <User className="size-6 text-line-strong" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-display text-base font-semibold text-ink">
                {m.name}
              </p>
              <p className="truncate text-small text-ink-muted">{m.role}</p>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <IconBtn
                label="Subir"
                onClick={() => move(m, "up")}
                disabled={i === 0}
              >
                <ArrowUp className="size-4" aria-hidden="true" />
              </IconBtn>
              <IconBtn
                label="Bajar"
                onClick={() => move(m, "down")}
                disabled={i === members.length - 1}
              >
                <ArrowDown className="size-4" aria-hidden="true" />
              </IconBtn>
              <IconBtn label="Editar" onClick={() => startEdit(m)}>
                <Pencil className="size-4" aria-hidden="true" />
              </IconBtn>
              <IconBtn
                label="Eliminar"
                onClick={() => handleDelete(m)}
                disabled={deletingId === m.id}
                tone="danger"
              >
                {deletingId === m.id ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Trash2 className="size-4" aria-hidden="true" />
                )}
              </IconBtn>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MemberForm({
  draft,
  setDraft,
  onCancel,
  onSubmit,
  saving,
  isNew,
}: {
  draft: DraftMember;
  setDraft: (d: DraftMember) => void;
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
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-h3 leading-h3 font-semibold text-ink">
          {isNew ? "Nuevo perfil" : "Editar perfil"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="inline-flex size-9 items-center justify-center rounded-md border border-line text-ink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="text-label font-semibold">Nombre y apellido</span>
          <input
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            required
            className={inputBase}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-label font-semibold">Rol o área</span>
          <input
            value={draft.role}
            onChange={(e) => setDraft({ ...draft, role: e.target.value })}
            placeholder="Socio · Estudio Jurídico"
            required
            className={inputBase}
          />
        </label>
        <label className="grid gap-1.5 sm:col-span-2">
          <span className="text-label font-semibold">
            URL de la foto{" "}
            <span className="font-normal text-ink-muted">(opcional)</span>
          </span>
          <input
            value={draft.photo_url}
            onChange={(e) => setDraft({ ...draft, photo_url: e.target.value })}
            placeholder="https://... (foto cuadrada o 4:5 recomendada)"
            className={inputBase}
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-label font-semibold">
            Orden{" "}
            <span className="font-normal text-ink-muted">
              (menor = aparece antes)
            </span>
          </span>
          <input
            type="number"
            value={draft.position}
            onChange={(e) =>
              setDraft({
                ...draft,
                position: Number.parseInt(e.target.value, 10) || 0,
              })
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
              {isNew ? "Agregar" : "Guardar cambios"}
            </>
          )}
        </Button>
      </div>
    </form>
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
        "inline-flex size-9 items-center justify-center rounded-md border transition-colors disabled:opacity-40 disabled:pointer-events-none",
        tone === "danger"
          ? "border-line text-ink-muted hover:border-[#B3261E] hover:text-[#B3261E]"
          : "border-line text-ink-muted hover:border-blue hover:text-blue",
      )}
    >
      {children}
    </button>
  );
}
