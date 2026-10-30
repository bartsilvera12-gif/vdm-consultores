import { useCallback, useEffect, useState } from "react";
import {
  Scale,
  TrendingUp,
  Globe2,
  Factory,
  Briefcase,
  Building2,
  Leaf,
  KeyRound,
  Scale3d,
  type LucideIcon,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { areas as defaults, type Area } from "@/content/areas";

/** Fila tal como vive en public.vdm_areas. */
export type AreaRow = {
  id: string;
  slug: string;
  position: number;
  eyebrow: string;
  title: string;
  description: string;
  summary: string;
  icon: string;
};

export type AreaServiceRow = {
  id: string;
  area_id: string;
  label: string;
  position: number;
};

/** Catálogo de iconos aceptados. Fallback: Briefcase. */
export const AREA_ICONS: Record<string, LucideIcon> = {
  scale: Scale,
  "scale-3d": Scale3d,
  "trending-up": TrendingUp,
  globe: Globe2,
  factory: Factory,
  briefcase: Briefcase,
  building: Building2,
  leaf: Leaf,
  key: KeyRound,
};

export function getAreaIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Briefcase;
  return AREA_ICONS[name.toLowerCase()] ?? Briefcase;
}

type UseAreasReturn = {
  areas: Area[];
  loading: boolean;
  refresh: () => Promise<void>;
};

/**
 * Lee todas las áreas con su lista de servicios en 2 queries. Si Supabase
 * no responde cae a src/content/areas.ts para que el sitio nunca quede vacío.
 */
export function useAreas(): UseAreasReturn {
  const [areas, setAreas] = useState<Area[]>(defaults);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: areasData }, { data: servicesData }] = await Promise.all([
      client
        .from("vdm_areas")
        .select("*")
        .order("position", { ascending: true }),
      client
        .from("vdm_area_services")
        .select("*")
        .order("position", { ascending: true }),
    ]);
    setLoading(false);
    if (!areasData || areasData.length === 0) return;
    const servicesByArea = new Map<string, AreaServiceRow[]>();
    for (const row of (servicesData ?? []) as AreaServiceRow[]) {
      const arr = servicesByArea.get(row.area_id) ?? [];
      arr.push(row);
      servicesByArea.set(row.area_id, arr);
    }
    setAreas(
      (areasData as AreaRow[]).map((row) => ({
        id: row.slug,
        eyebrow: row.eyebrow,
        title: row.title,
        description: row.description,
        summary: row.summary,
        services: (servicesByArea.get(row.id) ?? []).map((s) => s.label),
        icon: getAreaIcon(row.icon),
      })),
    );
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { areas, loading, refresh };
}
