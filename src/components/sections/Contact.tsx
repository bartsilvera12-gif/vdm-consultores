import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocation } from "react-router-dom";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { WhatsAppIcon } from "@/components/primitives/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { areas } from "@/content/areas";
import { useContactInfo } from "@/hooks/useContactInfo";
import { enviarConsulta, type Consulta } from "@/lib/supabase";
import { cn } from "@/lib/utils";

type Field = "nombre" | "email" | "telefono" | "area" | "mensaje";

const errorMsg: Record<Field, string> = {
  nombre: "Escribe tu nombre.",
  email: "Revisa el correo: falta el @ o el dominio.",
  telefono: "Deja un número para contactarte.",
  area: "Elige el servicio de tu consulta.",
  mensaje: "Escribe tu consulta.",
};

/** Link de WhatsApp con la consulta ya escrita, para cuando falla el envío. */
function whatsappUrl(href: string, c: Consulta) {
  const text = [
    "Hola, quiero hacer una consulta desde la web de VDM Consultores.",
    "",
    `Nombre: ${c.nombre}`,
    ...(c.empresa ? [`Empresa: ${c.empresa}`] : []),
    `Correo: ${c.email}`,
    `Teléfono: ${c.telefono}`,
    `Servicio: ${c.area}`,
    "",
    `Consulta: ${c.mensaje}`,
  ].join("\n");
  return `${href.split("?")[0]}?text=${encodeURIComponent(text)}`;
}

export function Contact({ embedded = false }: { embedded?: boolean } = {}) {
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const location = useLocation();
  const contactInfo = useContactInfo();

  // Pre-selección del área al llegar desde el apartado Servicios
  // (<Link to="/contacto" state={{ area }}>) o desde el bloque de áreas en Home
  // (preselectArea manipula el <select> directamente).
  useEffect(() => {
    const state = location.state as { area?: string } | null;
    if (!state?.area) return;
    const select = formRef.current?.elements.namedItem(
      "area",
    ) as HTMLSelectElement | null;
    if (!select) return;
    select.value = state.area;
  }, [location.state]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newErrors: Partial<Record<Field, boolean>> = {};
    (["nombre", "email", "telefono", "area", "mensaje"] as Field[]).forEach(
      (f) => {
        const el = form.elements.namedItem(f) as
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement
          | null;
        const value = String(data.get(f) ?? "").trim();
        const valid = !!el?.checkValidity() && value !== "";
        if (!valid) newErrors[f] = true;
      },
    );
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0] as Field;
      (form.elements.namedItem(firstKey) as HTMLElement | null)?.focus();
      return;
    }

    const payload: Consulta = {
      nombre: String(data.get("nombre") ?? "").trim(),
      empresa: String(data.get("empresa") ?? "").trim() || undefined,
      email: String(data.get("email") ?? "").trim(),
      telefono: String(data.get("telefono") ?? "").trim(),
      area: String(data.get("area") ?? "").trim() as Consulta["area"],
      mensaje: String(data.get("mensaje") ?? "").trim(),
    };

    setSubmitting(true);
    const result = await enviarConsulta({
      ...payload,
      sitio: String(data.get("sitio") ?? ""),
    });
    setSubmitting(false);

    if (!result.ok) {
      toast.error("No pudimos enviar tu consulta", {
        description: result.error,
        action: {
          label: "Enviar por WhatsApp",
          onClick: () =>
            window.open(
              whatsappUrl(contactInfo.whatsapp.href ?? "", payload),
              "_blank",
              "noopener",
            ),
        },
      });
      return;
    }

    form.reset();
    toast.success("Recibimos tu consulta", {
      description: "Un profesional del área te responderá a la brevedad.",
    });
  }

  function clearError(f: Field) {
    setErrors((prev) => ({ ...prev, [f]: false }));
  }

  return (
    <section id="contacto" className="bg-surface-alt py-16 md:py-24">
      <Container>
        <div className="grid gap-10 md:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-18">
          {/* Info columns ------------------------------------------------- */}
          <div className="grid content-start gap-6">
            {!embedded && (
              <div className="grid gap-4">
                <Eyebrow>Contacto</Eyebrow>
                <h2 className="font-display text-[28px] leading-[34px] font-semibold tracking-h2 md:text-h2 md:leading-h2">
                  Conversemos sobre tus proyectos. Estamos para asesorarte
                </h2>
                <p className="text-lead text-ink-muted">
                  Escríbenos y un profesional del área te responderá.
                </p>
              </div>
            )}
            <ContactRow
              icon={<WhatsAppIcon className="size-5" />}
              label={contactInfo.whatsapp.label}
              value={contactInfo.whatsapp.value}
              pending={contactInfo.whatsapp.pending}
            />
            <ContactRow
              icon={<Mail className="size-5" aria-hidden="true" />}
              label={contactInfo.email.label}
              value={contactInfo.email.value}
              pending={contactInfo.email.pending}
            />
            <ContactRow
              icon={<MapPin className="size-5" aria-hidden="true" />}
              label={contactInfo.office.label}
              value={contactInfo.office.value}
              pending={contactInfo.office.pending}
            />
            <ContactRow
              icon={<Facebook className="size-5" aria-hidden="true" />}
              label={contactInfo.facebook.label}
              value={contactInfo.facebook.value}
              pending={contactInfo.facebook.pending}
              href={contactInfo.facebook.href}
            />
            <ContactRow
              icon={<Instagram className="size-5" aria-hidden="true" />}
              label={contactInfo.instagram.label}
              value={contactInfo.instagram.value}
              pending={contactInfo.instagram.pending}
              href={contactInfo.instagram.href}
            />
            {!contactInfo.linkedin.pending && (
              <ContactRow
                icon={<Linkedin className="size-5" aria-hidden="true" />}
                label={contactInfo.linkedin.label}
                value={contactInfo.linkedin.value}
                pending={contactInfo.linkedin.pending}
                href={contactInfo.linkedin.href}
              />
            )}
          </div>

          {/* Form --------------------------------------------------------- */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="grid gap-4 rounded-lg border border-line bg-surface p-5 shadow-card sm:p-7 md:grid-cols-2 md:gap-x-5 md:p-10"
          >
            <FormField
              id="f-nombre"
              name="nombre"
              label="Nombre y apellido"
              autoComplete="name"
              required
              invalid={!!errors.nombre}
              onChange={() => clearError("nombre")}
            />
            <FormField
              id="f-empresa"
              name="empresa"
              label="Empresa"
              hint="(opcional)"
              autoComplete="organization"
            />
            <FormField
              id="f-email"
              name="email"
              type="email"
              label="Correo electrónico"
              autoComplete="email"
              required
              invalid={!!errors.email}
              onChange={() => clearError("email")}
            />
            <FormField
              id="f-telefono"
              name="telefono"
              type="tel"
              label="Teléfono o WhatsApp"
              placeholder="+595"
              autoComplete="tel"
              required
              invalid={!!errors.telefono}
              onChange={() => clearError("telefono")}
            />
            <FormField
              id="f-area"
              name="area"
              label="Servicio de interés"
              required
              invalid={!!errors.area}
              onChange={() => clearError("area")}
              className="md:col-span-2"
              as="select"
            >
              <option value="">Selecciona un servicio</option>
              {areas.map((a) => (
                <option key={a.id} value={a.eyebrow}>
                  {a.eyebrow}
                </option>
              ))}
              <option value="Otra consulta">Otra consulta</option>
            </FormField>
            <FormField
              id="f-mensaje"
              name="mensaje"
              label="Tu consulta"
              placeholder="Cuéntanos brevemente qué necesitas"
              required
              invalid={!!errors.mensaje}
              onChange={() => clearError("mensaje")}
              className="md:col-span-2"
              as="textarea"
            />
            <input
              type="text"
              name="sitio"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px]"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
              <small className="max-w-[40ch] text-small text-ink-muted">
                Usamos tus datos solo para responder esta consulta.
              </small>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Enviando…
                  </>
                ) : (
                  <>
                    Enviar consulta
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  pending,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  pending?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid size-11 place-items-center rounded-full bg-blue/10 text-blue">
        {icon}
      </span>
      <div>
        <p className="text-small text-ink-muted">{label}</p>
        <p
          className={cn(
            "break-words text-base font-semibold",
            pending && "font-normal italic text-ink-muted",
          )}
        >
          {value}
          {pending && " (a confirmar)"}
        </p>
      </div>
    </>
  );
  const className = "grid grid-cols-[44px_1fr] items-start gap-3.5";
  // Si hay href válido y no está pendiente, lo volvemos clickeable.
  if (href && href !== "#" && !pending) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(className, "group transition-colors")}
      >
        {content}
      </a>
    );
  }
  return <div className={className}>{content}</div>;
}

type BaseFieldProps = {
  id: string;
  name: Field | "empresa";
  label: string;
  hint?: string;
  required?: boolean;
  invalid?: boolean;
  onChange?: () => void;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  type?: string;
};

type FormFieldProps = BaseFieldProps &
  (
    | { as?: undefined }
    | { as: "select"; children: React.ReactNode }
    | { as: "textarea"; children?: never }
  );

function FormField(props: FormFieldProps) {
  const {
    id,
    name,
    label,
    hint,
    required,
    invalid,
    onChange,
    autoComplete,
    placeholder,
    className,
    type = "text",
  } = props;
  const inputBase =
    "min-h-12 w-full rounded-md border border-line-strong bg-surface-alt px-3.5 py-3 text-base text-ink transition-colors focus:border-blue focus:outline-focus-ring aria-[invalid=true]:border-[#B3261E]";

  return (
    <div className={cn("grid min-w-0 gap-1.5", className)}>
      <label htmlFor={id} className="text-label font-semibold">
        {label}
        {hint && (
          <span className="ml-1 font-normal text-ink-muted">{hint}</span>
        )}
      </label>
      {props.as === "select" ? (
        <select
          id={id}
          name={name}
          required={required}
          aria-invalid={invalid || undefined}
          onChange={onChange}
          className={inputBase}
        >
          {props.children}
        </select>
      ) : props.as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          aria-invalid={invalid || undefined}
          placeholder={placeholder}
          onChange={onChange}
          className={cn(inputBase, "min-h-32 resize-y")}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          aria-invalid={invalid || undefined}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={onChange}
          className={inputBase}
        />
      )}
      {invalid && name !== "empresa" && (
        <span className="text-small text-[#B3261E]">
          {errorMsg[name as Field]}
        </span>
      )}
    </div>
  );
}
