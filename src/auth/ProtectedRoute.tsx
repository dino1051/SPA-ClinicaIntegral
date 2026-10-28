import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
  rolesPermitidos?: Role[];
}

export default function ProtectedRoute({
  rolesPermitidos,
}: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !role) {
    return <Navigate to="/login" replace />;
  }

  if (rolesPermitidos && !rolesPermitidos.includes(role!)) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return <Outlet />;
}
