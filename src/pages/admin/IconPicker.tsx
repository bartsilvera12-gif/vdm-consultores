import { getAreaIcon } from "@/hooks/useAreas";
import { cn } from "@/lib/utils";

/**
 * Catálogo compartido de íconos elegibles desde el admin. La clave `name` es
 * lo que se guarda en la DB (vdm_areas.icon, vdm_sectors.icon); `label` es
 * sólo UI, en español, para que el cliente no vea "briefcase" ni "trending-up".
 */
export const ICON_OPTIONS: Array<{ name: string; label: string }> = [
  { name: "scale", label: "Balanza" },
  { name: "trending-up", label: "Crecimiento" },
  { name: "globe", label: "Globo" },
  { name: "factory", label: "Fábrica" },
  { name: "briefcase", label: "Maletín" },
  { name: "building", label: "Edificio" },
  { name: "leaf", label: "Hoja" },
  { name: "key", label: "Llave" },
];

/** Grilla visual para elegir un ícono. Click = selecciona. */
export function IconPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
      {ICON_OPTIONS.map((opt) => {
        const Icon = getAreaIcon(opt.name);
        const selected = value === opt.name;
        return (
          <button
            key={opt.name}
            type="button"
            onClick={() => onChange(opt.name)}
            title={opt.label}
            className={cn(
              "grid aspect-square place-items-center rounded-md border transition-all",
              selected
                ? "border-blue bg-blue text-white shadow-card"
                : "border-line bg-surface text-ink-muted hover:border-blue hover:text-blue",
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
            <span className="sr-only">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
