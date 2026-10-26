/**
 * Variables de entorno expuestas al bundle. Se leen una sola vez al arranque.
 * Un sitio desplegado SIEMPRE debe tener las dos primeras; en desarrollo pueden
 * estar vacías y el formulario cae al modo "preview" con un toast informativo.
 */
export const env = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ?? "",
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  consultasFunction:
    import.meta.env.VITE_SUPABASE_CONSULTAS_FUNCTION ?? "enviar-consulta",
};

export const supabaseConfigured =
  env.supabaseUrl.length > 0 && env.supabaseAnonKey.length > 0;
