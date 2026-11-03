export type NavLink = {
  to: string;
  label: string;
  /** Para resaltar el link cuando estamos en una ruta anidada o un hash. */
  match?: (pathname: string) => boolean;
};

export const navLinks: NavLink[] = [
  { to: "/", label: "Inicio" },
  { to: "/nosotros", label: "Quiénes somos" },
  { to: "/servicios", label: "Servicios" },
  { to: "/equipo", label: "Equipo" },
  { to: "/experiencia", label: "Experiencia" },
  { to: "/galeria", label: "Galería" },
  { to: "/contacto", label: "Contacto" },
];
