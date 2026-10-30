import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export type DisciplineRow = {
  id: string;
  position: number;
  label: string;
};

const DEFAULTS: string[] = [
  "Jurídica",
  "Tributaria",
  "Empresarial",
  "Ambiental",
  "Migratoria",
  "Industrial",
  "Comercio exterior",
  "Registro de Marcas",
];

type UseDisciplinesReturn = {
  disciplines: string[];
  loading: boolean;
  refresh: () => Promise<void>;
};

export function useDisciplines(): UseDisciplinesReturn {
  const [disciplines, setDisciplines] = useState<string[]>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await client
      .from("vdm_disciplines")
      .select("*")
      .order("position", { ascending: true });
    setLoading(false);
    if (error || !data || data.length === 0) return;
    setDisciplines((data as DisciplineRow[]).map((r) => r.label));
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { disciplines, loading, refresh };
}
