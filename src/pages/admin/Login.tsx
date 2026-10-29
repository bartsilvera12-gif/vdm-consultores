import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Logo } from "@/components/primitives/Logo";
import { Button } from "@/components/ui/button";
import { signInWithPassword, useAuth } from "@/lib/auth";

export function AdminLogin() {
  const { session, loading, disabled } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string } | null)?.from || "/admin";

  useEffect(() => {
    if (session) navigate(from, { replace: true });
  }, [session, navigate, from]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await signInWithPassword(email.trim(), password);
    setSubmitting(false);
    if (!res.ok) setError(res.error);
  }

  if (loading && !disabled) {
    return <div className="min-h-screen bg-surface" aria-busy="true" />;
  }
  if (session) {
    return <Navigate to={from} replace />;
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface-alt">
      <header className="border-b border-line bg-surface">
        <Container className="flex h-18 items-center">
          <Link to="/" aria-label="VDM Consultores, inicio">
            <Logo />
          </Link>
        </Container>
      </header>
      <section className="flex flex-1 items-center">
        <Container>
          <div className="mx-auto max-w-md rounded-lg border border-line bg-surface p-7 shadow-card sm:p-10">
            <h1 className="font-display text-h3 leading-h3 font-semibold text-ink">
              Panel administrador
            </h1>
            <p className="mt-2 text-small text-ink-muted">
              Ingresá con tu correo y contraseña de VDM.
            </p>
            <form onSubmit={onSubmit} className="mt-6 grid gap-4" noValidate>
              <div className="grid gap-1.5">
                <label htmlFor="email" className="text-label font-semibold">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-12 w-full rounded-md border border-line-strong bg-surface px-3.5 py-3 text-base text-ink focus:border-blue focus:outline-focus-ring"
                />
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="password" className="text-label font-semibold">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="min-h-12 w-full rounded-md border border-line-strong bg-surface px-3.5 py-3 text-base text-ink focus:border-blue focus:outline-focus-ring"
                />
              </div>
              {error && (
                <p className="rounded-sm border border-[#B3261E]/40 bg-[#FEEEEC] px-3 py-2 text-small text-[#B3261E]">
                  {error}
                </p>
              )}
              {disabled && (
                <p className="rounded-sm border border-line bg-surface-alt px-3 py-2 text-small text-ink-muted">
                  Supabase no está configurado en este entorno. Definí
                  <code className="mx-1">VITE_SUPABASE_URL</code> y
                  <code className="mx-1">VITE_SUPABASE_ANON_KEY</code> en
                  <code className="mx-1">.env.local</code>.
                </p>
              )}
              <Button type="submit" disabled={submitting || disabled}>
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Ingresando…
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </form>
          </div>
        </Container>
      </section>
    </main>
  );
}
