import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ícono de línea en dos tonos: azul, con el tramo inferior derecho en celeste
 * (corte en diagonal, como la V del logo). El tamaño lo da `className`.
 */
export function TwoToneIcon({
  icon: Icon,
  className,
  strokeWidth = 1.25,
  tone = "blue",
}: {
  icon: LucideIcon;
  className?: string;
  strokeWidth?: number;
  tone?: "blue" | "onNavy";
}) {
  return (
    <span className={cn("relative block", className)} aria-hidden="true">
      <Icon
        className={cn(
          "absolute inset-0 size-full",
          tone === "blue" ? "text-blue" : "text-on-navy",
        )}
        strokeWidth={strokeWidth}
      />
      <Icon
        className="absolute inset-0 size-full text-sky [clip-path:polygon(100%_25%,100%_100%,25%_100%)]"
        strokeWidth={strokeWidth}
      />
    </span>
  );
}
