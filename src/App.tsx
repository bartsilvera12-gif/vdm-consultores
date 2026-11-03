import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Sitio público */}
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="equipo" element={<Equipo />} />
          <Route path="experiencia" element={<Experiencia />} />
          <Route path="galeria" element={<Galeria />} />
          <Route path="contacto" element={<Contacto />} />
        </Route>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
