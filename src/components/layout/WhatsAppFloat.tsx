import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/primitives/WhatsAppIcon";
import { contactInfo } from "@/content/contact";

/** El ícono de WhatsApp del footer (Footer.tsx) donde se acopla el botón. */
export const WA_DOCK_ID = "wa-dock";
const FLY_MS = 420;

/**
 * Botón flotante de WhatsApp. Al llegar al footer vuela hasta su lugar junto a
 * las redes y se queda ahí como un ícono más; al volver a subir, regresa a la
 * esquina. Con prefers-reduced-motion cambia sin animación.
 */
export function WhatsAppFloat() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const [offset, setOffset] = useState<{ x: number; y: number; s: number } | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const dock = document.getElementById(WA_DOCK_ID);
    const btn = btnRef.current;
    if (!dock || !btn) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer = 0;

    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearTimeout(timer);
        if (entry.isIntersecting) {
          const b = btn.getBoundingClientRect();
          const d = dock.getBoundingClientRect();
          setOffset({
            x: d.left + d.width / 2 - (b.left + b.width / 2),
            y: d.top + d.height / 2 - (b.top + b.height / 2),
            s: d.width / b.width,
          });
          timer = window.setTimeout(
            () => {
              setHidden(true);
              dock.dataset.docked = "true";
            },
            reduced ? 0 : FLY_MS,
          );
        } else {
          dock.dataset.docked = "false";
          setHidden(false);
          setOffset(null);
        }
      },
      { threshold: 1 },
    );
    io.observe(dock);
    return () => {
      window.clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <a
      ref={btnRef}
      href={contactInfo.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className="fixed z-40 grid size-14 place-items-center rounded-full text-[#0F1E33] shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-[transform,opacity] duration-[420ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
      style={{
        backgroundColor: "#25D366",
        right: "max(1.25rem, env(safe-area-inset-right))",
        bottom: "max(1.25rem, env(safe-area-inset-bottom))",
        transform: offset
          ? `translate(${offset.x}px, ${offset.y}px) scale(${offset.s})`
          : undefined,
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden || offset ? "none" : undefined,
        transitionDuration: hidden ? "0ms" : undefined,
      }}
    >
      <WhatsAppIcon className="size-8" />
    </a>
  );
}
