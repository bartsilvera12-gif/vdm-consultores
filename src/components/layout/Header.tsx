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
        <a
          href="#inicio"
          aria-label="VDM Consultores, inicio"
          className="flex flex-none items-center"
        >
          <Logo />
        </a>
        <nav
          aria-label="Principal"
          className="hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 font-display text-sm font-medium text-ink transition-[color,background-color] hover:bg-surface-alt hover:text-blue"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <a href="#contacto">Agenda tu consulta</a>
          </Button>
          <MobileDrawer />
        </div>
      </Container>
    </header>
  );
}
