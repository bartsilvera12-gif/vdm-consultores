import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/primitives/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Reveal } from "@/components/primitives/Reveal";
import { WhatsAppIcon } from "@/components/primitives/WhatsAppIcon";
import { Button } from "@/components/ui/button";
import { useContactInfo } from "@/hooks/useContactInfo";
import { useSiteContent } from "@/hooks/useSiteContent";

/**
 * Cierre de la portada: la invitación a escribir a la izquierda (textos
 * editables del panel) y los canales directos a la derecha, en tarjetas.
 */
export function CtaBand() {
  const keys = useMemo(
    () => ["cta.title" as const, "cta.body" as const],
    [],
  );
  const content = useSiteContent(keys);
  const contact = useContactInfo();

  const channels = [
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      value: contact.whatsapp.value,
      href: contact.whatsapp.href,
      external: true,
    },
    {
      icon: Mail,
      label: contact.email.label,
      value: contact.email.value,
      href: contact.email.href,
      external: false,
    },
    {
      icon: MapPin,
      label: contact.office.label,
      value: contact.office.value,
      href: "/contacto",
      external: false,
    },
  ].filter((c) => c.value && !c.value.toLowerCase().includes("pendiente"));

  return (
    <section aria-label="Contacto" className="bg-ink text-on-navy">
      <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:gap-14 md:py-20">
        <Reveal className="grid gap-5">
          <Eyebrow tone="onNavy">Contacto</Eyebrow>
          <h2 className="max-w-[22ch] text-[28px] leading-[34px] font-bold text-on-navy md:text-[38px] md:leading-[44px]">
            {content["cta.title"]}
          </h2>
          <p className="max-w-[48ch] text-body text-on-navy-muted md:text-lead">
            {content["cta.body"]}
          </p>
          <div className="mt-2">
            <Button asChild variant="onNavy" size="lg" className="group text-blue">
              <Link to="/contacto">
                Contáctenos
                <ArrowRight
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </Reveal>

        <ul className="m-0 grid list-none gap-3 p-0">
          {channels.map((c, i) => {
            const Icon = c.icon;
            const href = c.href ?? "/contacto";
            const inner = (
              <>
                <span className="grid size-11 flex-none place-items-center rounded-full bg-white/10 text-on-navy transition-colors duration-200 group-hover:bg-on-navy group-hover:text-navy">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="grid min-w-0">
                  <span className="text-small text-on-navy-muted">{c.label}</span>
                  <span className="truncate font-display text-base font-semibold text-on-navy">
                    {c.value}
                  </span>
                </span>
                <ArrowRight
                  className="ml-auto size-4 flex-none text-on-navy-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-on-navy"
                  aria-hidden="true"
                />
              </>
            );
            const cls =
              "group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 px-5 py-4 transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10";
            return (
              <Reveal as="li" key={c.label} delay={100 + i * 80}>
                {href.startsWith("/") ? (
                  <Link to={href} className={cls}>
                    {inner}
                  </Link>
                ) : (
                  <a
                    href={href}
                    className={cls}
                    {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {inner}
                  </a>
                )}
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
