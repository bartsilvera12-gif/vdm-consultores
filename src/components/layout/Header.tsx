import { Link, NavLink } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Logo } from "@/components/primitives/Logo";
import { Button } from "@/components/ui/button";
import { navPages } from "@/content/nav";
import { usePath, useT } from "@/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const scrolled = useScrolled();
  const t = useT();
  const path = usePath();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent bg-surface/90 backdrop-blur-md backdrop-saturate-150 transition-[border-color,box-shadow] duration-200",
        scrolled && "border-line shadow-card",
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-6">
        <Link
          to={path("home")}
          aria-label={t.common.logoHome}
          className="flex flex-none items-center"
        >
          <Logo />
        </Link>
        <nav
          aria-label={t.common.mainNav}
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex"
        >
          {navPages.map((page) => (
            <NavLink
              key={page}
              to={path(page)}
              end={page === "home"}
              className={({ isActive }) =>
                cn(
                  "group relative whitespace-nowrap px-2.5 py-2 font-display text-sm font-semibold tracking-[0.01em] transition-colors duration-200",
                  isActive ? "text-blue" : "text-ink hover:text-blue",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {t.nav[page]}
                  {/* Línea fina que crece desde el centro al pasar o en la página actual. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-2.5 -bottom-0.5 h-[2px] origin-center rounded-full bg-blue transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>
        {/* Banderas y botón con ancho fijo: no se mueven al cambiar de idioma. */}
        <div className="flex flex-none items-center gap-2">
          <LanguageSwitcher flagsOnly className="hidden sm:flex" />
          <Button asChild size="sm" className="hidden w-[188px] justify-center xl:inline-flex">
            <Link to={path("contacto")}>{t.common.bookConsultation}</Link>
          </Button>
          <MobileDrawer />
        </div>
      </Container>
    </header>
  );
}
