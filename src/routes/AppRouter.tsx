import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "../components/layout/MainLayout";
import { PacientesPage } from "../pages/PacientesPage";
import { PacienteDetallePage } from "../pages/PacienteDetallePage";
import { NuevaCitaPage } from "../pages/NuevaCitaPage";
import { NotFoundPage } from "../pages/NotFoundPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/pacientes" replace />} />

          <Route path="/pacientes" element={<PacientesPage />} />

          <Route path="/pacientes/Byid/:id" element={<PacienteDetallePage />} />

          <Route path="/citas/nueva" element={<NuevaCitaPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
