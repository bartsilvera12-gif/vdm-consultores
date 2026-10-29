import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

type AuthState = {
  session: Session | null;
  /** `true` mientras no sabemos si hay sesión (chequeo inicial o cuando faltan env vars). */
  loading: boolean;
  /** `true` cuando Supabase no está configurado (desarrollo sin .env.local). */
  disabled: boolean;
};

/**
 * Hook de sesión. Se suscribe a los cambios de auth de Supabase, así cualquier
 * componente (p. ej. RequireAuth) reacciona al signIn/signOut sin recargar.
 */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = client.auth.onAuthStateChange((_evt, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading, disabled: !getSupabase() };
}

export async function signInWithPassword(email: string, password: string) {
  const client = getSupabase();
  if (!client) {
    return {
      ok: false as const,
      error:
        "Supabase no está configurado en este entorno. Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.",
    };
  }
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, session: data.session };
}

export async function signOut() {
  const client = getSupabase();
  if (!client) return;
  await client.auth.signOut();
}
