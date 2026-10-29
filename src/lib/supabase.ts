import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, supabaseConfigured } from "./env";

let client: SupabaseClient | null = null;

/**
 * Devuelve el cliente de Supabase. En desarrollo sin env vars retorna null:
 * el llamador decide qué hacer (típicamente, mostrar un fallback).
 */
export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) {
    client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
      // Persistimos la sesión para que el /admin recuerde el login entre
      // recargas y pestañas (localStorage, flujo estándar de Supabase Auth).
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}

export type Consulta = {
  nombre: string;
  empresa?: string;
  email: string;
  telefono: string;
  area:
    | "Estudio Jurídico"
    | "Consultoría Empresarial"
    | "Asesoría en Inversiones"
    | "Habilitaciones Industriales y Comerciales"
    | "Otra consulta";
  mensaje: string;
};

export type EnviarConsultaResult =
  | { ok: true; id: string; emailStatus: "enviado" | "error" }
  | { ok: false; error: string; status: "preview" | "network" | "server" };

/**
 * Llama a la Edge Function `enviar-consulta`, que valida, guarda la fila en
 * `public.consultas` y envía el correo a VDM a través de Resend.
 */
export async function enviarConsulta(
  payload: Consulta,
): Promise<EnviarConsultaResult> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      ok: false,
      status: "preview",
      error:
        "Vista previa: Supabase no está configurado en este entorno. Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY para enviar la consulta.",
    };
  }

  const { data, error } = await supabase.functions.invoke<
    { ok: true; id: string; emailStatus: "enviado" | "error" } | { error: string }
  >(env.consultasFunction, {
    body: payload,
  });

  if (error) {
    return {
      ok: false,
      status: "network",
      error: error.message || "No pudimos enviar la consulta. Intenta de nuevo.",
    };
  }
  if (!data || "error" in data) {
    return {
      ok: false,
      status: "server",
      error:
        (data && "error" in data && data.error) ||
        "La consulta no se registró. Intenta de nuevo.",
    };
  }

  return { ok: true, id: data.id, emailStatus: data.emailStatus };
}
