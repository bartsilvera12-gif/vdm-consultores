import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        // Respeta safe-area iOS (notch, home indicator) sin perder el padding mínimo.
        "mx-auto w-full max-w-[1180px] px-[max(1rem,env(safe-area-inset-left))] [padding-right:max(1rem,env(safe-area-inset-right))] md:px-[max(3rem,env(safe-area-inset-left))] md:[padding-right:max(3rem,env(safe-area-inset-right))]",
        className,
      )}
    >
      {children}
    </div>
  );
}
