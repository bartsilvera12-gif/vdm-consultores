import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Mail, MessageCircleQuestion, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { CONSULTAS_CHANGED } from "./ConsultasBell";

type ConsultaRow = {
  id: string;
  created_at: string;
  nombre: string;
  empresa: string | null;
  email: string;
  telefono: string;
  area: string;
  mensaje: string;
  atendida: boolean;
  atendida_at: string | null;
};

const AREAS_FILTER = [
  "Todas",
  "Estudio Jurídico",
  "Consultoría Empresarial",
  "Asesoría en Inversiones",
  "Habilitaciones Industriales y Comerciales",
  "Otra consulta",
];

export function Consultas() {
  const [rows, setRows] = useState<ConsultaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"todas" | "pendientes" | "atendidas">(
    "pendientes",
  );
  const [area, setArea] = useState<string>("Todas");

  async function fetchAll() {
    const client = getSupabase();
    if (!client) return;
    setLoading(true);
    const { data } = await client
      .from("vdm_consultas")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    setRows((data ?? []) as ConsultaRow[]);
  }

  useEffect(() => {
    void fetchAll();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status === "pendientes" && r.atendida) return false;
      if (status === "atendidas" && !r.atendida) return false;
      if (area !== "Todas" && r.area !== area) return false;
      return true;
    });
  }, [rows, status, area]);

  async function toggleAtendida(r: ConsultaRow) {
    const client = getSupabase();
    if (!client) return;
    const next = !r.atendida;
    const { error } = await client
      .from("vdm_consultas")
      .update({
        atendida: next,
        atendida_at: next ? new Date().toISOString() : null,
      })
      .eq("id", r.id);
    if (error) {
      toast.error("No pudimos actualizar", { description: error.message });
      return;
    }
    toast.success(next ? "Marcada como atendida" : "Marcada como pendiente");
    window.dispatchEvent(new Event(CONSULTAS_CHANGED));
    void fetchAll();
  }

  if (loading) {
    return (
      <div className="grid min-h-48 place-items-center" aria-busy="true">
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  const pendientesCount = rows.filter((r) => !r.atendida).length;

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-h2 leading-h2 font-semibold text-ink">
            Consultas del formulario
          </h1>
          <p className="mt-2 max-w-xl text-body text-ink-muted">
            {rows.length === 0
              ? "Todavía no hay consultas."
              : `${rows.length} consultas · ${pendientesCount} pendientes.`}
          </p>
        </div>
      </header>

      {rows.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border border-line bg-surface p-3">
          <div className="flex gap-1">
            {(["pendientes", "atendidas", "todas"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-small font-semibold capitalize transition-colors",
                  status === s
                    ? "bg-blue text-white"
                    : "bg-surface-alt text-ink hover:bg-blue/10 hover:text-blue",
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="min-h-9 rounded-md border border-line-strong bg-surface px-3 text-small focus:border-blue focus:outline-focus-ring"
          >
            {AREAS_FILTER.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      )}

      <ul className="grid gap-3">
        {filtered.length === 0 && (
          <li className="rounded-lg border border-dashed border-line bg-surface p-6 text-center text-small text-ink-muted">
            Sin consultas con esos filtros.
          </li>
        )}
        {filtered.map((r) => (
          <li
            key={r.id}
            className={cn(
              "grid gap-3 rounded-lg border border-line bg-surface p-4",
              r.atendida && "opacity-70",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-base font-semibold text-ink">
                  {r.nombre}
                  {r.empresa && (
                    <span className="font-normal text-ink-muted">
                      {" · "}
                      {r.empresa}
                    </span>
                  )}
                </p>
                <p className="text-small text-ink-muted">
                  {r.area} · {new Date(r.created_at).toLocaleString("es-PY")}
                </p>
              </div>
              <Button
                size="sm"
                variant={r.atendida ? "outline" : "default"}
                onClick={() => toggleAtendida(r)}
              >
                <Check className="size-4" aria-hidden="true" />
                {r.atendida ? "Reabrir" : "Marcar atendida"}
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-small text-ink-muted">
              <a
                href={`mailto:${r.email}`}
                className="inline-flex items-center gap-1.5 text-blue hover:underline"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                {r.email}
              </a>
              <a
                href={`https://wa.me/${r.telefono.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue hover:underline"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                {r.telefono}
              </a>
            </div>
            <p className="whitespace-pre-wrap rounded-md border border-line bg-surface-alt p-3 text-body text-ink">
              <MessageCircleQuestion
                className="mr-2 inline size-4 text-blue"
                aria-hidden="true"
              />
              {r.mensaje}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
