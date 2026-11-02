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
  | { ok: true; emailStatus: "enviado" | "error" }
  | { ok: false; error: string };

/**
 * Llama a `public/api/consulta.php`, que envía el correo a VDM y guarda la
 * fila en `public.vdm_consultas`. `sitio` es el campo oculto anti-bots.
 */
export async function enviarConsulta(
  payload: Consulta & { sitio: string },
): Promise<EnviarConsultaResult> {
  try {
    const res = await fetch("/api/consulta.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (await res.json()) as EnviarConsultaResult;
  } catch {
    return { ok: false, error: "No pudimos enviar la consulta." };
  }
}
