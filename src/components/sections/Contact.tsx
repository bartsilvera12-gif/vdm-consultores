import { useState, type FormEvent } from "react";
import { ArrowRight, Linkedin, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { WhatsAppIcon } from "@/components/primitives/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { contactInfo } from "@/content/contact";
import { areas } from "@/content/areas";
import { cn } from "@/lib/utils";

type Field = "name" | "email" | "phone" | "area" | "msg";

const errorMsg: Record<Field, string> = {
  name: "Escribe tu nombre.",
  email: "Revisa el correo: falta el @ o el dominio.",
  phone: "Deja un número para contactarte.",
  area: "Elige el área de tu consulta.",
  msg: "Escribe tu consulta.",
};

export function Contact() {
  const [errors, setErrors] = useState<Partial<Record<Field, boolean>>>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newErrors: Partial<Record<Field, boolean>> = {};
    (["name", "email", "phone", "area", "msg"] as Field[]).forEach((f) => {
      const el = form.elements.namedItem(f) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null;
      const value = String(data.get(f) ?? "").trim();
      const valid = !!el?.checkValidity() && value !== "";
      if (!valid) newErrors[f] = true;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0] as Field;
      (form.elements.namedItem(firstKey) as HTMLElement | null)?.focus();
      return;
    }
    form.reset();
    toast.success(
      "Vista previa: en el sitio publicado esta consulta llegará al correo de VDM.",
    );
  }

  function clearError(f: Field) {
    setErrors((prev) => ({ ...prev, [f]: false }));
  }

  return (
    <section id="contacto" className="py-16 md:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-18">
          {/* Info columns ------------------------------------------------- */}
          <div className="grid content-start gap-6">
            <div className="grid gap-4">
              <Eyebrow>Contacto</Eyebrow>
              <h2 className="font-display text-[28px] leading-[34px] font-semibold tracking-h2 md:text-h2 md:leading-h2">
                Hablemos de tu empresa o tu inversión
              </h2>
              <p className="text-lead text-ink-muted">
                Escríbenos y un profesional del área te responderá.
              </p>
            </div>
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
              icon={<Linkedin className="size-5" aria-hidden="true" />}
              label={contactInfo.linkedin.label}
              value={contactInfo.linkedin.value}
              pending={contactInfo.linkedin.pending}
            />
          </div>

          {/* Form --------------------------------------------------------- */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid gap-4 rounded-lg bg-surface-alt p-7 md:grid-cols-2 md:gap-x-5 md:p-10"
          >
            <FormField
              id="f-name"
              name="name"
              label="Nombre y apellido"
              autoComplete="name"
              required
              invalid={!!errors.name}
              onChange={() => clearError("name")}
            />
            <FormField
              id="f-company"
              name="company"
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
              id="f-phone"
              name="phone"
              type="tel"
              label="Teléfono o WhatsApp"
              placeholder="+595"
              autoComplete="tel"
              required
              invalid={!!errors.phone}
              onChange={() => clearError("phone")}
            />
            <FormField
              id="f-area"
              name="area"
              label="Área de interés"
              required
              invalid={!!errors.area}
              onChange={() => clearError("area")}
              className="md:col-span-2"
              as="select"
            >
              <option value="">Selecciona un área</option>
              {areas.map((a) => (
                <option key={a.id} value={a.eyebrow}>
                  {a.eyebrow}
                </option>
              ))}
              <option value="Otra consulta">Otra consulta</option>
            </FormField>
            <FormField
              id="f-msg"
              name="msg"
              label="Tu consulta"
              placeholder="Cuéntanos brevemente qué necesitas"
              required
              invalid={!!errors.msg}
              onChange={() => clearError("msg")}
              className="md:col-span-2"
              as="textarea"
            />
            <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
              <small className="max-w-[40ch] text-small text-ink-muted">
                Usamos tus datos solo para responder esta consulta.
              </small>
              <Button type="submit">
                Enviar consulta
                <ArrowRight className="size-4" aria-hidden="true" />
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  pending?: boolean;
}) {
  return (
    <div className="grid grid-cols-[44px_1fr] items-start gap-3.5">
      <span className="grid size-11 place-items-center rounded-md bg-surface-alt text-blue">
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
    </div>
  );
}

type BaseFieldProps = {
  id: string;
  name: Field | "company";
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
    "min-h-12 w-full rounded-md border border-line-strong bg-surface px-3.5 py-3 text-base text-ink transition-colors focus:border-blue focus:outline-focus-ring aria-[invalid=true]:border-[#B3261E]";

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
      {invalid && (
        <span className="text-small text-[#B3261E]">
          {errorMsg[name as Field]}
        </span>
      )}
    </div>
  );
}
