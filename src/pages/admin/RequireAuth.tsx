import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

/**
 * Si no hay sesión, redirige a /admin/login guardando dónde quería ir el
 * usuario (para volver después del login). Mientras se verifica, muestra una
 * pantalla vacía — es muy breve y evita el parpadeo al redirect.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="min-h-screen bg-surface" aria-busy="true" />;
  }
  if (!session) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }
  return <>{children}</>;
}
