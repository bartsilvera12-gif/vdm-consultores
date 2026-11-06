import { useState } from "react";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { navPages } from "@/content/nav";
import { usePath, useT } from "@/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const t = useT();
  const path = usePath();

  return (
    <Drawer.Root
      open={open}
      onOpenChange={setOpen}
      direction="right"
      handleOnly
    >
      <Drawer.Trigger asChild>
        <button
          type="button"
          aria-label={t.common.openMenu}
          className="group inline-flex size-11 flex-col items-end justify-center gap-[5px] rounded-md pr-1.5 lg:hidden"
        >
          {/* Tres rayas, una por color de la marca: navy, azul y celeste. */}
          <span aria-hidden="true" className="block h-[3px] w-7 rounded-full bg-navy" />
          <span
            aria-hidden="true"
            className="block h-[3px] w-5 rounded-full bg-blue transition-[width] duration-200 ease-out group-hover:w-7"
          />
          <span
            aria-hidden="true"
            className="block h-[3px] w-3.5 rounded-full bg-sky transition-[width] duration-200 ease-out group-hover:w-7"
          />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[70] bg-navy/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-[80] flex h-full w-[86vw] max-w-[360px] flex-col gap-1.5 bg-surface p-6 outline-none"
        >
          <Drawer.Title className="sr-only">{t.common.menu}</Drawer.Title>
          <button
            type="button"
            aria-label={t.common.closeMenu}
            onClick={close}
            className="mb-2 inline-flex size-11 items-center justify-center self-end rounded-md border border-line text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          <LanguageSwitcher className="mb-2 -ml-1.5" onNavigate={close} />
          {navPages.map((page) => (
            <NavLink
              key={page}
              to={path(page)}
              end={page === "home"}
              onClick={close}
              className={({ isActive }) =>
                cn(
                  "border-b border-line py-3 font-display text-lg font-semibold",
                  isActive ? "text-blue" : "text-ink",
                )
              }
            >
              {t.nav[page]}
            </NavLink>
          ))}
          <Button asChild size="lg" className="mt-5 w-full" onClick={close}>
            <Link to={path("contacto")}>{t.common.bookConsultation}</Link>
          </Button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
