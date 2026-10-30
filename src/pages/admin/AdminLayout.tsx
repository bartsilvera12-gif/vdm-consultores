import {
  Layers,
  LogOut,
  Mail,
  MessageCircleQuestion,
  PanelsTopLeft,
  Sparkles,
  Tag,
  Type,
  Users,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Container } from "@/components/primitives/Container";
import { Logo } from "@/components/primitives/Logo";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { RequireAuth } from "./RequireAuth";

const adminLinks = [
  { to: "/admin", end: true, label: "Resumen", icon: PanelsTopLeft },
  { to: "/admin/consultas", end: false, label: "Consultas", icon: Mail },
  { to: "/admin/areas", end: false, label: "Áreas de servicio", icon: Layers },
  { to: "/admin/experiencia", end: false, label: "Experiencia", icon: Sparkles },
  { to: "/admin/equipo", end: false, label: "Equipo", icon: Users },
  { to: "/admin/disciplinas", end: false, label: "Disciplinas", icon: Tag },
  { to: "/admin/contacto", end: false, label: "Datos de contacto", icon: MessageCircleQuestion },
  { to: "/admin/textos", end: false, label: "Textos de secciones", icon: Type },
];

export function AdminLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col bg-surface-alt">
        <header className="sticky top-0 z-40 border-b border-line bg-surface">
          <Container className="flex h-18 items-center justify-between gap-6">
            <Link
              to="/"
              aria-label="VDM Consultores, inicio"
              className="flex flex-none items-center"
            >
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link to="/">Ver sitio</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="inline-flex gap-2"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Salir
              </Button>
            </div>
          </Container>
        </header>
        <div className="flex flex-1">
          <Container className="flex flex-col gap-8 py-8 lg:flex-row lg:gap-10 lg:py-12">
            <aside className="lg:w-56 lg:flex-none">
              <nav aria-label="Secciones del administrador">
                <ul className="flex flex-wrap gap-1 lg:flex-col lg:gap-0.5">
                  {adminLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          end={link.end}
                          className={({ isActive }) =>
                            cn(
                              "inline-flex items-center gap-2 rounded-md px-3 py-2 font-display text-sm font-medium transition-colors",
                              isActive
                                ? "bg-surface text-blue shadow-card lg:bg-surface"
                                : "text-ink hover:bg-surface hover:text-blue",
                            )
                          }
                        >
                          <Icon className="size-4" aria-hidden="true" />
                          {link.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
            <section className="min-w-0 flex-1">
              <Outlet />
            </section>
          </Container>
        </div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            classNames: {
              toast:
                "font-sans text-small rounded-md border border-line bg-ink text-surface shadow-card",
            },
          }}
        />
      </div>
    </RequireAuth>
  );
}
