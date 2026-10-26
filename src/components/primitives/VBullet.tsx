import { cn } from "@/lib/utils";

/**
 * Punto de lista con la silueta de la V del logo. Trazo abierto, 1.8-2.2 ancho,
 * color por currentColor para que el padre lo pinte en `orange`.
 */
export function VBullet({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 14"
      className={cn("size-3.5 shrink-0", className)}
    >
      <path
        d="M2 3l5 8 5-8"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinejoin="miter"
      />
    </svg>
  );
}
