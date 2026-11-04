import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { lazy, Suspense } from "react";

import { MainLayout } from "../components/layout/MainLayout";
import ProtectedRoute from "../auth/ProtectedRoute";
import Spinner from "../components/Spinner";

// Página que permanece con carga inmediata
import LoginPage from "../pages/LoginPage";

// Páginas con carga diferida
const PacientesPage = lazy(() =>
  import("../pages/PacientesPage").then((module) => ({
    default: module.PacientesPage,
  })),
);

const PacienteDetallePage = lazy(() =>
  import("../pages/PacienteDetallePage").then((module) => ({
    default: module.PacienteDetallePage,
  })),
);

const NuevaCitaPage = lazy(() =>
  import("../pages/NuevaCitaPage").then((module) => ({
    default: module.NuevaCitaPage,
  })),
);

const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((module) => ({
    default: module.NotFoundPage,
  })),
);

const ProfilePage = lazy(() =>
  import("../pages/ProfilePage").then((module) => ({
    default: module.default,
  })),
);

const CitasPage = lazy(() =>
  import("../pages/CitasPage").then((module) => ({
    default: module.default,
  })),
);

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner fullscreen />}>
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

            {/* Solo recepción puede gestionar citas */}
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
      </Suspense>
    </BrowserRouter>
  );
}
