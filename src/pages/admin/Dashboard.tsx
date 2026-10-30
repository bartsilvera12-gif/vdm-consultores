import { Link } from "react-router-dom";
import {
  ArrowRight,
  Layers,
  Mail,
  MessageCircleQuestion,
  Sparkles,
  Tag,
  Type,
  Users,
} from "lucide-react";

const cards = [
  {
    to: "/admin/consultas",
    icon: Mail,
    title: "Consultas",
    body: "Mensajes enviados desde el formulario público. Filtros y marcar como atendidas.",
  },
  {
    to: "/admin/areas",
    icon: Layers,
    title: "Áreas de servicio",
    body: "Las 4 áreas que aparecen en Servicios. Editá título, descripción y lista de servicios.",
  },
  {
    to: "/admin/experiencia",
    icon: Sparkles,
    title: "Experiencia",
    body: "Las tarjetas de 'A quiénes acompañamos'. Agregar, editar o reordenar.",
  },
  {
    to: "/admin/equipo",
    icon: Users,
    title: "Equipo",
    body: "Perfiles del equipo (nombre, rol, foto). Subida de imagen desde la PC.",
  },
  {
    to: "/admin/disciplinas",
    icon: Tag,
    title: "Disciplinas",
    body: "Las pastillas azules de Quiénes somos.",
  },
  {
    to: "/admin/contacto",
    icon: MessageCircleQuestion,
    title: "Datos de contacto",
    body: "WhatsApp, correo, oficina y redes sociales.",
  },
  {
    to: "/admin/textos",
    icon: Type,
    title: "Textos de secciones",
    body: "Titulares, bajadas y copys de todo el sitio.",
  },
];

export function AdminDashboard() {
  return (
    <div className="grid gap-6">
      <header>
        <h1 className="font-display text-h2 leading-h2 font-semibold text-ink">
          Panel administrador
        </h1>
        <p className="mt-2 max-w-xl text-body text-ink-muted">
          Desde acá podés mantener actualizados los contenidos de la web
          institucional sin tocar código.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <li key={card.to}>
              <Link
                to={card.to}
                className="group grid h-full gap-3 rounded-lg border border-line bg-surface p-6 transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="grid size-10 place-items-center rounded-md border border-line bg-surface-alt text-blue">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="font-display text-h3 leading-h3 font-semibold text-ink">
                  {card.title}
                </h2>
                <p className="text-body text-ink-muted">{card.body}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-small font-semibold text-blue">
                  Abrir
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
