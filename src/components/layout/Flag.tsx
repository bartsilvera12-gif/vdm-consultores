import type { Lang } from "@/i18n/langs";

/**
 * Banderitas del selector de idioma, dibujadas en SVG (los emojis de bandera
 * no se ven en Windows). Español = Paraguay, inglés = Estados Unidos,
 * portugués = Brasil.
 */
export function Flag({ lang, className }: { lang: Lang; className?: string }) {
  const common = {
    viewBox: "0 0 30 20",
    className,
    "aria-hidden": true as const,
    focusable: "false" as const,
  };
  if (lang === "es") {
    return (
      <svg {...common}>
        <rect width="30" height="20" fill="#fff" />
        <rect width="30" height="6.67" fill="#D52B1E" />
        <rect y="13.33" width="30" height="6.67" fill="#0038A8" />
        {/* Escudo: corona verde con la estrella amarilla (lo que la distingue de Holanda). */}
        <circle cx="15" cy="10" r="3.6" fill="#fff" />
        <circle cx="15" cy="10" r="3" fill="none" stroke="#2E8B3A" strokeWidth="1.1" />
        <path
          d="M15 7.9l.62 1.27 1.4.2-1.01.99.24 1.39L15 11.1l-1.25.65.24-1.39-1.01-.99 1.4-.2z"
          fill="#E8B400"
        />
      </svg>
    );
  }
  if (lang === "en") {
    return (
      <svg {...common}>
        <rect width="30" height="20" fill="#fff" />
        {[0, 2, 4, 6, 8, 10, 12].map((i) => (
          <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#B22234" />
        ))}
        <rect width="13" height={(20 / 13) * 7} fill="#3C3B6E" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <circle key={`${r}-${c}`} cx={2 + c * 3} cy={2 + r * 3.4} r="0.55" fill="#fff" />
          )),
        )}
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect width="30" height="20" fill="#009C3B" />
      <path d="M15 2.2 27.2 10 15 17.8 2.8 10Z" fill="#FFDF00" />
      <circle cx="15" cy="10" r="4.6" fill="#002776" />
      <path d="M10.6 9.2c3-.9 6.3-.6 8.9 1" stroke="#fff" strokeWidth="0.7" fill="none" />
    </svg>
  );
}
