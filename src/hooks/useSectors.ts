import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { sectors as defaults, type Sector } from "@/content/sectors";
import { getAreaIcon } from "./useAreas";

export type SectorRow = {
  id: string;
  position: number;
  title: string;
  body: string;
  icon: string;
};

type UseSectorsReturn = {
  sectors: Sector[];
  loading: boolean;
  refresh: () => Promise<void>;
};

/**
 * Lee las tarjetas de "A quiénes acompañamos" desde vdm_sectors.
 * Fallback a src/content/sectors.ts.
 */
export function useSectors(): UseSectorsReturn {
  const [sectors, setSectors] = useState<Sector[]>(defaults);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await client
      .from("vdm_sectors")
      .select("*")
      .order("position", { ascending: true });
    setLoading(false);
    if (error || !data || data.length === 0) return;
    setSectors(
      (data as SectorRow[]).map((row) => ({
        title: row.title,
        body: row.body,
        icon: getAreaIcon(row.icon),
      })),
    );
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { sectors, loading, refresh };
}
