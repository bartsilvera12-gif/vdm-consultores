import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Estado de un carrusel horizontal con scroll nativo: mueve de a una tarjeta
 * (`[data-card]`) y avisa si queda contenido hacia cada lado, para deshabilitar
 * las flechas en los extremos y ocultarlas cuando todo entra en pantalla.
 */
export function useCarousel<T extends HTMLElement>() {
  const trackRef = useRef<T>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 1);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [update]);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const amount = card ? card.offsetWidth + gap : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  return { trackRef, canPrev, canNext, scrollByCard, update };
}
