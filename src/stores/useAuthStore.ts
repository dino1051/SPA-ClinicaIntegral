import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { iniciarSesion } from "../services/auth";
import type { LoginDTO, Role } from "../types/auth";

export interface UsuarioPerfil {
  id: number | null;
  nombre: string;
  email: string;
  telefono: string;
  foto: string | null;
}

interface AuthState {
  token: string | null;
  cargando: boolean;
  error: string | null;
  role: Role | null;
  usuario: UsuarioPerfil;

  login: (datos: LoginDTO) => Promise<void>;
  logout: () => void;
  limpiarError: () => void;
  actualizarUsuario: (datos: Partial<UsuarioPerfil>) => void;
}

function obtenerRol(role?: string): Role | null {
  if (role === "ADMIN" || role === "DOCTOR" || role === "RECEPCION") {
    return role;
  }

  return null;
}

const usuarioInicial: UsuarioPerfil = {
  id: null,
  nombre: "",
  email: "",
  telefono: "",
  foto: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      cargando: false,
      error: null,
      role: null,
      usuario: { ...usuarioInicial },

      // Iniciar sesión
      login: async (datos) => {
        set({ cargando: true, error: null });

        try {
          const respuesta = await iniciarSesion(datos);

          const role = obtenerRol(respuesta.usuario.role);

          if (!role) {
            throw new Error("El usuario tiene un rol no válido.");
          }

          set({
            token: respuesta.token,
            role,
            error: null,
            usuario: {
              id: respuesta.usuario.id,
              nombre: respuesta.usuario.nombre ?? "",
              email: respuesta.usuario.email,
              telefono: "",
              foto: null,
            },
          });
        } catch (error: any) {
          const mensaje =
            error.response?.data?.message ??
            error.message ??
            "No fue posible iniciar sesión.";

          set({ error: mensaje });
          throw error;
        } finally {
          set({ cargando: false });
        }
      },

      // Cerrar sesión
      logout: () => {
        set({
          token: null,
          role: null,
          error: null,
          usuario: { ...usuarioInicial },
        });
      },

      limpiarError: () => set({ error: null }),

      // Actualizar información local del perfil
      actualizarUsuario: (datos) =>
        set((state) => ({
          usuario: {
            ...state.usuario,
            ...datos,
          },
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),

      // Solo persistimos los datos que necesitamos conservar.
      partialize: (state) => ({
        token: state.token,
        role: state.role,
        usuario: state.usuario,
      }),
    },
  ),
);
