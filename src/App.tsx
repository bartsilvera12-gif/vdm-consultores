import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Nosotros } from "@/pages/Nosotros";
import { Servicios } from "@/pages/Servicios";
import { Equipo } from "@/pages/Equipo";
import { Experiencia } from "@/pages/Experiencia";
import { Contacto } from "@/pages/Contacto";
import { Galeria } from "@/pages/Galeria";
import { AdminLogin } from "@/pages/admin/Login";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/Dashboard";
import { EditContact } from "@/pages/admin/EditContact";
import { EditTeam } from "@/pages/admin/EditTeam";
import { EditTexts } from "@/pages/admin/EditTexts";
import { EditAreas } from "@/pages/admin/EditAreas";
import { EditSectors } from "@/pages/admin/EditSectors";
import { EditDisciplines } from "@/pages/admin/EditDisciplines";
import { EditMedia } from "@/pages/admin/EditMedia";
import { Consultas } from "@/pages/admin/Consultas";
import { LANGS, SLUGS, pathFor, type Lang, type PageKey } from "@/i18n/langs";

const PAGES: Record<Exclude<PageKey, "home">, () => JSX.Element> = {
  nosotros: Nosotros,
  servicios: Servicios,
  equipo: Equipo,
  experiencia: Experiencia,
  galeria: Galeria,
  contacto: Contacto,
};

/** Idioma preferido del navegador entre los tres del sitio. */
function preferredLang(): Lang {
  const list = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const l of list) {
    const code = l?.slice(0, 2).toLowerCase();
    if ((LANGS as readonly string[]).includes(code)) return code as Lang;
  }
  return "es";
}

/** "/" → inicio en el idioma del navegador (español si no es ninguno de los tres). */
function RootRedirect() {
  return <Navigate to={pathFor("home", preferredLang())} replace />;
}

/** Dirección inexistente → inicio del mismo idioma (o el del navegador). */
function NotFound() {
  const { pathname } = useLocation();
  const l = pathname.split("/")[1];
  const lang = (LANGS as readonly string[]).includes(l) ? (l as Lang) : preferredLang();
  return <Navigate to={pathFor("home", lang)} replace />;
}

/** Direcciones viejas sin idioma (/nosotros#la-firma) → la versión en español. */
function LegacyRedirect({ page }: { page: PageKey }) {
  const { hash } = useLocation();
  return <Navigate to={pathFor(page, "es") + hash} replace />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sitio público: /es, /en y /pt, cada página con su dirección. */}
        <Route index element={<RootRedirect />} />
        {LANGS.map((lang) => (
          <Route key={lang} path={lang} element={<Layout lang={lang} />}>
            <Route index element={<Home />} />
            {(Object.keys(PAGES) as Array<keyof typeof PAGES>).map((page) => {
              const Page = PAGES[page];
              return <Route key={page} path={SLUGS[page][lang]} element={<Page />} />;
            })}
          </Route>
        ))}
        {(Object.keys(PAGES) as Array<keyof typeof PAGES>).map((page) => (
          <Route key={page} path={SLUGS[page].es} element={<LegacyRedirect page={page} />} />
        ))}
        {/* Admin */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="consultas" element={<Consultas />} />
          <Route path="areas" element={<EditAreas />} />
          <Route path="experiencia" element={<EditSectors />} />
          <Route path="equipo" element={<EditTeam />} />
          <Route path="disciplinas" element={<EditDisciplines />} />
          <Route path="imagenes" element={<EditMedia />} />
          <Route path="contacto" element={<EditContact />} />
          <Route path="textos" element={<EditTexts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
