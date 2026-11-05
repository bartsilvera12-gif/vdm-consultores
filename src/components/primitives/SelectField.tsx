import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

/**
 * Desplegable con el estilo del sitio (no el del navegador). Debajo sigue
 * habiendo un <select> real, oculto, con el mismo id y name: el formulario
 * lo lee con FormData, lo valida con `required`, lo vacía con reset() y
 * preselectArea() lo puede cambiar desde otras secciones. Este componente
 * solo lo muestra y lo maneja (mouse y teclado).
 */
export function SelectField({
  id,
  name,
  placeholder,
  options,
  required,
  invalid,
  onChange,
  className,
}: {
  id: string;
  name: string;
  placeholder: string;
  options: SelectOption[];
  required?: boolean;
  invalid?: boolean;
  onChange?: () => void;
  className?: string;
}) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  // Mantener la vista igual al <select> cuando lo cambian desde afuera
  // (preselección de área, reset del formulario).
  useEffect(() => {
    const select = selectRef.current;
    if (!select) return;
    const sync = () => setValue(select.value);
    const form = select.form;
    const onReset = () => setTimeout(sync, 0);
    select.addEventListener("change", sync);
    form?.addEventListener("reset", onReset);
    sync();
    return () => {
      select.removeEventListener("change", sync);
      form?.removeEventListener("reset", onReset);
    };
  }, []);

  // Cerrar al hacer clic afuera.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  function choose(v: string) {
    const select = selectRef.current;
    if (select) {
      select.value = v;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setValue(v);
    setOpen(false);
    onChange?.();
    buttonRef.current?.focus();
  }

  function openList() {
    const i = options.findIndex((o) => o.value === value);
    setHighlight(i >= 0 ? i : 0);
    setOpen(true);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const o = options[highlight];
      if (o) choose(o.value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const current = options.find((o) => o.value === value);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {/* El select real, oculto: si el formulario le pasa el foco (error), lo
          recibe el botón. */}
      <select
        ref={selectRef}
        id={id}
        name={name}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        onFocus={() => buttonRef.current?.focus()}
        className="sr-only"
        defaultValue=""
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${id}-label`}
        aria-invalid={invalid || undefined}
        aria-activedescendant={open ? `${listId}-${highlight}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex min-h-12 w-full items-center justify-between gap-3 rounded-md border border-line-strong bg-surface-alt px-3.5 py-3 text-left text-base transition-colors focus:border-blue focus:outline-focus-ring aria-[invalid=true]:border-[#B3261E]",
          open && "border-blue",
          current ? "text-ink" : "text-ink-muted",
        )}
      >
        <span className="truncate">{current?.label ?? placeholder}</span>
        <ChevronDown
          className={cn(
            "size-4 flex-none text-ink-muted transition-transform duration-200 ease-out",
            open && "rotate-180 text-blue",
          )}
          aria-hidden="true"
        />
      </button>

      <ul
        id={listId}
        role="listbox"
        aria-labelledby={`${id}-label`}
        className={cn(
          "absolute inset-x-0 top-full z-20 mt-1.5 grid origin-top overflow-hidden rounded-md border border-line bg-surface py-1.5 shadow-[0_8px_24px_rgba(10,39,71,0.10)] transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        {options.map((o, i) => {
          const selected = o.value === value;
          return (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={selected}
              onPointerEnter={() => setHighlight(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(o.value)}
              className={cn(
                "flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-base transition-colors",
                i === highlight ? "bg-surface-alt" : "bg-transparent",
                selected ? "font-semibold text-blue" : "text-ink",
              )}
            >
              <span>{o.label}</span>
              {selected && <Check className="size-4 flex-none" aria-hidden="true" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
