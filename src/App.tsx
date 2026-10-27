import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Nosotros } from "@/pages/Nosotros";
import { Servicios } from "@/pages/Servicios";
import { Equipo } from "@/pages/Equipo";
import { Experiencia } from "@/pages/Experiencia";
import { Contacto } from "@/pages/Contacto";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="equipo" element={<Equipo />} />
          <Route path="experiencia" element={<Experiencia />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
