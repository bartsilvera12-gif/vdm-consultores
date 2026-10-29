import { useCallback, useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import { team as defaults, type TeamMember } from "@/content/team";

/** Fila tal como vive en public.vdm_team_members. */
export type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  position: number;
  created_at?: string;
  updated_at?: string;
};

function rowToMember(row: TeamMemberRow): TeamMember & { id: string } {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    photo: row.photo_url ?? undefined,
  };
}

/**
 * Lee la lista de miembros del equipo. Fallback a los placeholders de
 * src/content/team.ts si Supabase no responde (sitio público nunca queda vacío).
 * Devuelve un `refresh` para que el admin pueda forzar la recarga tras una
 * mutación.
 */
export function useTeam() {
  const [members, setMembers] = useState<Array<TeamMember & { id?: string }>>(
    defaults,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const client = getSupabase();
    if (!client) {
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
      setError(error.message);
      return;
    }
    if (data && data.length > 0) {
      setMembers((data as TeamMemberRow[]).map(rowToMember));
      setError(null);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { members, loading, error, refresh };
}
