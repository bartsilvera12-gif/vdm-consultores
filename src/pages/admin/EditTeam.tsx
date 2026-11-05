import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import type { TeamMemberRow } from "@/hooks/useTeam";
import { cn } from "@/lib/utils";

/** Bucket público donde van las fotos subidas desde la PC. Ver migración 0003. */
const PHOTO_BUCKET = "vdm-team";
const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2 MiB (alineado con el límite del bucket)
const ALLOWED_PHOTO_TYPES = ["image/png", "image/jpeg"];

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

  /** Mueve un perfil a otra posición y renumera todos (10, 20, 30…). */
  async function reorder(from: number, to: number) {
    if (from === to) return;
    const next = [...members];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    const renumbered = next.map((m, i) => ({ ...m, position: (i + 1) * 10 }));
    const changed = renumbered.filter(
      (m) => members.find((o) => o.id === m.id)?.position !== m.position,
    );
    setMembers(renumbered);
    const client = getSupabase();
    if (!client || changed.length === 0) return;
    const { error } = await client.from("vdm_team_members").upsert(changed);
    if (error) {
      toast.error("No pudimos reordenar", { description: error.message });
      void fetchAll();
      return;
    }
    toast.success("Orden guardado", { description: "Ya se ve así en el sitio." });
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

      {members.length > 1 && <OrderBoard members={members} onMove={reorder} />}

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

/**
 * Orden en el sitio con miniaturas, armado igual que la página: arriba las
 * tres principales (la primera al medio) y abajo el resto. Se reordena
 * arrastrando una foto sobre otra, o tocando una y después el lugar adonde va
 * (sirve también en celular).
 */
function OrderBoard({
  members,
  onMove,
}: {
  members: TeamMemberRow[];
  onMove: (from: number, to: number) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const lead = members.slice(0, 3);
  const rest = members.slice(3);
  // Mismo orden visual que la página pública: la primera va al medio.
  const LEAD_ORDER = ["order-2", "order-1", "order-3"];

  function pick(i: number) {
    if (selected === null) {
      setSelected(i);
      return;
    }
    if (selected !== i) onMove(selected, i);
    setSelected(null);
  }

  function tile(m: TeamMemberRow, i: number, featured: boolean) {
    const isSelected = selected === i;
    const isOver = over === i && dragging !== null && dragging !== i;
    return (
      <li key={m.id} className={featured ? LEAD_ORDER[i] : undefined}>
        <button
          type="button"
          draggable
          onClick={() => pick(i)}
          onDragStart={(e) => {
            setDragging(i);
            setSelected(null);
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", String(i));
          }}
          onDragEnd={() => {
            setDragging(null);
            setOver(null);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            if (over !== i) setOver(i);
          }}
          onDragLeave={() => setOver((o) => (o === i ? null : o))}
          onDrop={(e) => {
            e.preventDefault();
            const from = Number(e.dataTransfer.getData("text/plain"));
            setDragging(null);
            setOver(null);
            if (!Number.isNaN(from)) onMove(from, i);
          }}
          aria-pressed={isSelected}
          aria-label={`${m.name}, lugar ${i + 1}${isSelected ? ", elegido para mover" : ""}`}
          className={cn(
            "group grid w-full cursor-grab gap-1.5 rounded-md p-1.5 text-left transition-[background-color,box-shadow,opacity] duration-150 active:cursor-grabbing",
            isSelected && "bg-blue/10 ring-2 ring-blue",
            isOver && "bg-sky/10 ring-2 ring-sky ring-offset-2",
            dragging === i && "opacity-40",
            selected !== null && !isSelected && "hover:ring-2 hover:ring-sky/60",
          )}
        >
          <span
            className={cn(
              "relative block w-full overflow-hidden bg-[#e8edf3]",
              featured ? "aspect-[9/16]" : "aspect-[4/5]",
            )}
          >
            {m.photo_url ? (
              <img
                src={m.photo_url}
                alt=""
                draggable={false}
                loading="lazy"
                className="absolute inset-x-0 bottom-0 h-[92%] w-full object-contain object-bottom"
              />
            ) : (
              <User className="absolute inset-0 m-auto size-6 text-line-strong" aria-hidden="true" />
            )}
            <span className="absolute top-1.5 left-1.5 grid size-6 place-items-center rounded-full bg-ink text-[11px] font-semibold text-on-navy">
              {i + 1}
            </span>
          </span>
          <span className="truncate text-[12px] leading-[16px] font-semibold text-ink">{m.name}</span>
        </button>
      </li>
    );
  }

  return (
    <section className="grid gap-4 rounded-lg border border-line bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-h3 leading-h3 font-semibold text-ink">Orden en el sitio</h2>
        <p className="text-small text-ink-muted">
          {selected === null
            ? "Arrastrá una foto hasta otro lugar, o tocala y después tocá adónde va."
            : `Ahora tocá el lugar adonde va ${members[selected]?.name ?? ""}.`}
          {selected !== null && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="ml-2 font-semibold text-blue underline-offset-2 hover:underline"
            >
              Cancelar
            </button>
          )}
        </p>
      </div>
      <div className="grid gap-1">
        <p className="text-[12px] font-semibold tracking-wide text-ink-muted uppercase">
          Principales (la 1 va al medio)
        </p>
        <ul className="mx-auto grid w-full max-w-[420px] grid-cols-3 gap-2">
          {lead.map((m, i) => tile(m, i, true))}
        </ul>
      </div>
      {rest.length > 0 && (
        <div className="grid gap-1">
          <p className="text-[12px] font-semibold tracking-wide text-ink-muted uppercase">Resto del equipo</p>
          <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-8">
            {rest.map((m, i) => tile(m, i + 3, false))}
          </ul>
        </div>
      )}
    </section>
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      toast.error("Formato no soportado", {
        description: "Subí una imagen PNG o JPG.",
      });
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error("La imagen pesa demasiado", {
        description: `Máximo 2 MB (la tuya pesa ${(file.size / 1024 / 1024).toFixed(2)} MB).`,
      });
      return;
    }
    const client = getSupabase();
    if (!client) {
      toast.error("Supabase no está configurado.");
      return;
    }
    setUploading(true);
    // Path estable y único: team/<timestamp>-<random>.<ext>. Si el admin sube
    // más de una foto para el mismo perfil se van acumulando (no borramos la
    // anterior) — así nunca pisamos una URL que esté en uso en otra fila.
    const ext = file.type === "image/png" ? "png" : "jpg";
    const path = `team/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error: upErr } = await client.storage
      .from(PHOTO_BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      setUploading(false);
      toast.error("No pudimos subir la imagen", { description: upErr.message });
      return;
    }
    const { data } = client.storage.from(PHOTO_BUCKET).getPublicUrl(path);
    setUploading(false);
    setDraft({ ...draft, photo_url: data.publicUrl });
    toast.success("Imagen cargada", {
      description: "Recordá guardar los cambios para asignarla al perfil.",
    });
  }

  function clearPhoto() {
    setDraft({ ...draft, photo_url: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

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
        <div className="grid gap-3 sm:col-span-2">
          <span className="text-label font-semibold">
            Foto{" "}
            <span className="font-normal text-ink-muted">
              (opcional · PNG o JPG, máx. 2 MB; cuadrada o 4:5 recomendada)
            </span>
          </span>
          <div className="grid gap-3 sm:grid-cols-[112px_1fr] sm:items-start">
            <div className="grid aspect-[4/5] h-28 w-28 place-items-center overflow-hidden rounded-md border border-line bg-surface-alt sm:h-auto">
              {draft.photo_url ? (
                <img
                  src={draft.photo_url}
                  alt="Vista previa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User
                  className="size-10 text-line-strong"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="grid gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFile(file);
                }}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2
                        className="size-4 animate-spin"
                        aria-hidden="true"
                      />
                      Subiendo…
                    </>
                  ) : (
                    <>
                      <Upload className="size-4" aria-hidden="true" />
                      Subir imagen
                    </>
                  )}
                </Button>
                {draft.photo_url && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={clearPhoto}
                    disabled={uploading}
                  >
                    Quitar foto
                  </Button>
                )}
              </div>
              <input
                value={draft.photo_url}
                onChange={(e) =>
                  setDraft({ ...draft, photo_url: e.target.value })
                }
                placeholder="…o pegá una URL externa"
                className={inputBase}
              />
            </div>
          </div>
        </div>
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
