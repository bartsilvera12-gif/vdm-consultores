import { Link } from "react-router-dom";
import { Container } from "@/components/primitives/Container";
import { Logo } from "@/components/primitives/Logo";
import { useAreas } from "@/hooks/useAreas";

export function Footer() {
  const { areas } = useAreas();
  return (
    <footer className="border-t border-white/10 bg-navy text-on-navy-muted">
      <Container className="grid gap-10 pt-14 pb-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
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
              Áreas
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
                <Link to="/contacto" className="hover:text-on-navy">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-small">
          <span>© 2026 VDM Consultores. Todos los derechos reservados.</span>
          <span>Fortaleciendo empresas, potenciando inversiones.</span>
        </div>
      </Container>
    </footer>
  );
}
