import { Link, NavLink } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Logo } from "@/components/primitives/Logo";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/content/nav";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const scrolled = useScrolled();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent bg-surface/90 backdrop-blur-md backdrop-saturate-150 transition-[border-color,box-shadow] duration-200",
        scrolled && "border-line shadow-card",
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link
          to="/"
          aria-label="VDM Consultores, inicio"
          className="flex flex-none items-center"
        >
          <Logo />
        </Link>
        <nav
          aria-label="Principal"
          className="hidden items-center gap-1 lg:flex xl:gap-2"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group relative whitespace-nowrap px-2.5 py-2 font-display text-sm font-semibold tracking-[0.01em] transition-colors duration-200 xl:px-3",
                  isActive ? "text-blue" : "text-ink hover:text-blue",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {/* Línea fina que crece desde el centro al pasar o en la página actual. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-2.5 -bottom-0.5 h-[2px] origin-center rounded-full bg-blue transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] xl:inset-x-3",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link to="/contacto">Agenda tu consulta</Link>
          </Button>
          <MobileDrawer />
        </div>
      </Container>
    </header>
  );
}
