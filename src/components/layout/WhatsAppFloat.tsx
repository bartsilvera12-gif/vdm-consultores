import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "@/components/primitives/WhatsAppIcon";
import { contactInfo } from "@/content/contact";

/** El ícono de WhatsApp del footer (Footer.tsx) donde se acopla el botón. */
export const WA_DOCK_ID = "wa-dock";
const FLY_MS = 420;
const SIZE = 56;
const MARGIN = 20;

type Phase = "free" | "flying" | "docked";

/**
 * Botón flotante de WhatsApp. Cuando el ícono del footer entra entero en
 * pantalla, el botón vuela hasta él (siguiéndolo si se sigue bajando) y se
 * queda ahí como un ícono más; al volver a subir, regresa a la esquina.
 */
export function WhatsAppFloat() {
  const [phase, setPhase] = useState<Phase>("free");
  const [offset, setOffset] = useState<{ x: number; y: number; s: number } | null>(null);
  const phaseRef = useRef<Phase>("free");
  const startRef = useRef(0);

  useEffect(() => {
    const dock = document.getElementById(WA_DOCK_ID);
    if (!dock) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const go = (next: Phase) => {
      phaseRef.current = next;
      setPhase(next);
      dock.dataset.docked = next === "docked" ? "true" : "false";
    };

    const tick = () => {
      frame = 0;
      const d = dock.getBoundingClientRect();
      const vh = window.innerHeight;
      const inView = d.top >= 0 && d.bottom <= vh && d.width > 0;
      const p = phaseRef.current;

      if (!inView) {
        if (p !== "free") {
          go("free");
          setOffset(null);
        }
        return;
      }
      // Centro del botón en su esquina (sin el transform aplicado).
      const homeX = document.documentElement.clientWidth - MARGIN - SIZE / 2;
      const homeY = vh - MARGIN - SIZE / 2;
      setOffset({
        x: d.left + d.width / 2 - homeX,
        y: d.top + d.height / 2 - homeY,
        s: d.width / SIZE,
      });
      if (p === "free") {
        startRef.current = performance.now();
        go(reduced ? "docked" : "flying");
        if (!reduced) schedule();
      } else if (p === "flying") {
        if (performance.now() - startRef.current >= FLY_MS) go("docked");
        else schedule();
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const docked = phase === "docked";

  return (
    <a
      href={contactInfo.whatsapp.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      aria-hidden={docked || undefined}
      tabIndex={docked ? -1 : undefined}
      className="fixed z-40 grid size-14 place-items-center rounded-full text-[#0F1E33] shadow-[0_6px_20px_rgba(0,0,0,0.22)] transition-[transform,opacity] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
      style={{
        backgroundColor: "#25D366",
        right: `max(${MARGIN}px, env(safe-area-inset-right))`,
        bottom: `max(${MARGIN}px, env(safe-area-inset-bottom))`,
        transform: offset
          ? `translate(${offset.x}px, ${offset.y}px) scale(${offset.s})`
          : undefined,
        opacity: docked ? 0 : 1,
        pointerEvents: phase === "free" ? undefined : "none",
        // Volando se anima; acoplado sigue al ícono sin demora (y ya no se ve).
        transitionDuration: phase === "flying" ? `${FLY_MS}ms` : docked ? "0ms" : "300ms",
      }}
    >
      <WhatsAppIcon className="size-8" />
    </a>
  );
}
