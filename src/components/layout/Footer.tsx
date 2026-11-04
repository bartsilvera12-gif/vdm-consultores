import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Logo } from "@/components/primitives/Logo";
import { useAreas } from "@/hooks/useAreas";
import { useContactInfo } from "@/hooks/useContactInfo";
import { WhatsAppIcon } from "@/components/primitives/WhatsAppIcon";
import { WA_DOCK_ID } from "@/components/layout/WhatsAppFloat";

export function Footer() {
  const { areas } = useAreas();
  const contact = useContactInfo();
  type Social = { label: string; href: string; icon: typeof Facebook };
  const socials: Social[] = [];
  if (!contact.facebook.pending && contact.facebook.href && contact.facebook.href !== "#") {
    socials.push({ label: contact.facebook.label, href: contact.facebook.href, icon: Facebook });
  }
  if (!contact.instagram.pending && contact.instagram.href && contact.instagram.href !== "#") {
    socials.push({ label: contact.instagram.label, href: contact.instagram.href, icon: Instagram });
  }
  if (!contact.linkedin.pending && contact.linkedin.href && contact.linkedin.href !== "#") {
    socials.push({ label: contact.linkedin.label, href: contact.linkedin.href, icon: Linkedin });
  }

  return (
    <footer className="border-t border-white/10 bg-navy text-on-navy-muted">
      <Container className="grid gap-10 pt-14 pb-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/">
              <Logo variant="white" width={129} height={52} className="h-13" />
            </Link>
            <p className="mt-4 font-display text-base font-semibold text-on-navy">
              Un solo equipo, soluciones integrales.
            </p>
            <p className="mt-2 max-w-[40ch]">
              Asesoría jurídica, empresarial y de inversiones en Paraguay.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-display text-eyebrow uppercase tracking-eyebrow text-on-navy">
              Servicios
            </h4>
            <ul className="grid gap-2">
              {areas.map((area) => (
                <li key={area.id}>
                  <Link
                    to={`/servicios#${area.id}`}
                    className="transition-colors hover:text-on-navy"
                  >
                    {area.eyebrow}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-display text-eyebrow uppercase tracking-eyebrow text-on-navy">
              Firma
            </h4>
            <ul className="grid gap-2">
              <li>
                <Link to="/nosotros" className="hover:text-on-navy">
                  Quiénes somos
                </Link>
              </li>
              <li>
                <Link to="/equipo" className="hover:text-on-navy">
                  Equipo
                </Link>
              </li>
              <li>
                <Link to="/experiencia" className="hover:text-on-navy">
                  Experiencia
                </Link>
              </li>
              <li>
                <Link to="/galeria" className="hover:text-on-navy">
                  Galería
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="hover:text-on-navy">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-display text-eyebrow uppercase tracking-eyebrow text-on-navy">
              Síganos
            </h4>
            <ul className="flex items-center gap-2.5">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="inline-flex size-10 items-center justify-center rounded-full border border-white/15 text-on-navy transition-all hover:-translate-y-0.5 hover:border-blue-bright hover:bg-blue-bright hover:text-on-blue"
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
              {/* Acá se acopla el botón flotante de WhatsApp al llegar al footer. */}
              <li>
                <a
                  id={WA_DOCK_ID}
                  data-docked="false"
                  href={contact.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                  className="inline-flex size-10 scale-75 items-center justify-center rounded-full bg-[#25D366] text-[#0F1E33] opacity-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 data-[docked=true]:scale-100 data-[docked=true]:opacity-100 motion-reduce:transition-none"
                >
                  <WhatsAppIcon className="size-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-small">
          <span>© 2026 VDM Consultores. Todos los derechos reservados.</span>
          <span>Fortaleciendo empresas, potenciando inversiones.</span>
        </div>
        <p className="-mt-4 text-center text-[13px]">
          Desarrollado por{" "}
          <a
            href="https://neura.com.py"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-on-navy underline-offset-4 hover:underline"
          >
            Neura
          </a>
        </p>
      </Container>
    </footer>
  );
}
