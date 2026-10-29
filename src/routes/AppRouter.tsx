import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { MainLayout } from "../components/layout/MainLayout";
import { PacientesPage } from "../pages/PacientesPage";
import { PacienteDetallePage } from "../pages/PacienteDetallePage";
import { NuevaCitaPage } from "../pages/NuevaCitaPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import ProtectedRoute from "../auth/ProtectedRoute";
import ProfilePage from "../pages/ProfilePage";
import LoginPage from "../pages/LoginPage";
//import RegisterPage from "../pages/RegisterPage";
import CitasPage from "../pages/CitasPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route element={<MainLayout />}>
          {/* Rutas para cualquier usuario autenticado */}
          <Route element={<ProtectedRoute />}>
            <Route path="/citas" element={<CitasPage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route
              path="/pacientes/Byid/:id"
              element={<PacienteDetallePage />}
            />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          {/* Solo recepción puede gestionar usuarios */}
          <Route element={<ProtectedRoute rolesPermitidos={["RECEPCION"]} />}>
            <Route path="/citas/nueva" element={<NuevaCitaPage />} />
          </Route>
        </Route>
        <Route
          path="/acceso-denegado"
          element={
            <main className="p-8 text-center">
              <h1 className="text-2xl font-bold">Acceso denegado</h1>
              <p className="mt-2 text-slate-600">
                No tienes permisos para consultar esta página.
              </p>
            </main>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
