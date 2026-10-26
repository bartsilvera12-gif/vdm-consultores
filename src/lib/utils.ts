import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Registramos la escala tipográfica propia (definida en index.css con @theme,
// p. ej. text-small, text-label) como tamaños de fuente. Si no, tailwind-merge
// las trata como clases `text-*` genéricas y las colapsa con los colores de
// texto (text-on-blue, text-ink, ...), descartando el color. Ese bug dejaba el
// texto de los botones sm/lg sin color (ver botón "Agenda tu consulta").
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "hero",
            "h2",
            "h3",
            "eyebrow",
            "lead",
            "body",
            "small",
            "label",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
