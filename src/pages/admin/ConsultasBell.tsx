import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import { getSupabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

/** Consultas.tsx lo dispara al marcar atendida/pendiente, para refrescar ya. */
export const CONSULTAS_CHANGED = "vdm:consultas-changed";

const POLL_MS = 30_000;

type Pendiente = {
  id: string;
  nombre: string;
  area: string;
  created_at: string;
};

function hace(iso: string) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return "recién";
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  return new Date(iso).toLocaleDateString("es-PY", { day: "numeric", month: "short" });
}

/**
 * Campanita del panel: cuántas consultas siguen pendientes y las últimas cinco.
 * Revisa cada 30 s y al volver a la pestaña; si entra una nueva avisa con un
 * toast, así se sabe que la consulta de la web llegó.
 */
export function ConsultasBell() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Pendiente[]>([]);
  const [open, setOpen] = useState(false);
  const newestRef = useRef<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const client = getSupabase();
    if (!client) return;
    const { data, count: total, error } = await client
      .from("vdm_consultas")
      .select("id, nombre, area, created_at", { count: "exact" })
      .eq("atendida", false)
      .order("created_at", { ascending: false })
      .limit(5);
    if (error) return;
    const rows = (data ?? []) as Pendiente[];
    const newest = rows[0]?.created_at ?? null;
    if (newestRef.current && newest && newest > newestRef.current) {
      toast.success("Llegó una consulta nueva", {
        description: `${rows[0].nombre} · ${rows[0].area}`,
      });
    }
    if (newest) newestRef.current = newest;
    setItems(rows);
    setCount(total ?? rows.length);
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const onChanged = () => void refresh();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener(CONSULTAS_CHANGED, onChanged);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener(CONSULTAS_CHANGED, onChanged);
    };
  }, [refresh]);

  // Cerrar al hacer click afuera o con Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={
          count > 0 ? `${count} consultas pendientes` : "Sin consultas pendientes"
        }
        aria-expanded={open}
        className="relative grid size-9 place-items-center rounded-md border border-line bg-surface text-ink transition-colors hover:border-blue hover:text-blue"
      >
        <Bell className="size-4" aria-hidden="true" />
        {count > 0 && (
          <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-blue px-1 font-display text-[11px] font-bold leading-none text-on-blue">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-line bg-surface shadow-card motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-150">
          <p className="border-b border-line px-4 py-3 font-display text-small font-semibold text-ink">
            {count === 0
              ? "No hay consultas pendientes"
              : count === 1
                ? "1 consulta pendiente"
                : `${count} consultas pendientes`}
          </p>
          {items.length > 0 && (
            <ul className="m-0 list-none p-0">
              {items.map((c) => (
                <li key={c.id} className="border-b border-line last:border-b-0">
                  <Link
                    to="/admin/consultas"
                    onClick={() => setOpen(false)}
                    className="grid gap-0.5 px-4 py-2.5 transition-colors hover:bg-surface-alt"
                  >
                    <span className="truncate text-small font-semibold text-ink">
                      {c.nombre}
                    </span>
                    <span className="truncate text-[12px] text-ink-muted">
                      {c.area} · {hace(c.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/admin/consultas"
            onClick={() => setOpen(false)}
            className={cn(
              "block border-t border-line bg-surface-alt px-4 py-2.5 text-center text-small font-semibold text-blue hover:underline",
            )}
          >
            Ver todas las consultas
          </Link>
        </div>
      )}
    </div>
  );
}
