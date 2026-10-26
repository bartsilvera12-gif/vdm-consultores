import { useState } from "react";
import { Drawer } from "vaul";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/content/nav";
import { Button } from "@/components/ui/button";

export function MobileDrawer() {
  const [open, setOpen] = useState(false);

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
          aria-label="Abrir menú"
          className="inline-flex size-11 items-center justify-center rounded-md border border-line text-ink lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[70] bg-navy/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-[80] flex h-full w-[86vw] max-w-[360px] flex-col gap-1.5 bg-surface p-6 outline-none"
        >
          <Drawer.Title className="sr-only">Menú</Drawer.Title>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="mb-2 inline-flex size-11 items-center justify-center self-end rounded-md border border-line text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-3 font-display text-lg font-semibold text-ink"
            >
              {link.label}
            </a>
          ))}
          <Button
            asChild
            size="lg"
            className="mt-5 w-full"
            onClick={() => setOpen(false)}
          >
            <a href="#contacto">Agenda tu consulta</a>
          </Button>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
