import { create } from "zustand";
import { iniciarSesion, registrarUsuario } from "../services/auth";
import type { LoginDTO, RegisterDTO, Role } from "../types/auth";
import { jwtDecode } from "jwt-decode";

export interface UsuarioPerfil {
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
  register: (datos: RegisterDTO) => Promise<void>;
  logout: () => void;
  limpiarError: () => void;

  actualizarUsuario: (datos: Partial<UsuarioPerfil>) => void;
}
interface TokenPayload {
  id: number;
  email: string;
  role: Role;
  exp?: number;
}

function obtenerRol(token: string): Role | null {
  try {
    const payload = jwtDecode<TokenPayload>(token);

    if (payload.exp && payload.exp * 1000 <= Date.now()) {
      return null;
    }

    if (
      payload.role === "ADMIN" ||
      payload.role === "DOCTOR" ||
      payload.role === "RECEPCION"
    ) {
      return payload.role;
    }

    return null;
  } catch {
    return null;
  }
}

const usuarioInicial: UsuarioPerfil = {
  nombre: "Perfil Pruebas",
  email: "perfilpruebas@clinica.com",
  telefono: "5512345678",
  foto: null,
};

export const useAuthStore = create<AuthState>()((set) => ({
  token: localStorage.getItem("token"),
  cargando: false,
  error: null,

  role: localStorage.getItem("token")
    ? obtenerRol(localStorage.getItem("token")!)
    : null,

  usuario: { ...usuarioInicial },

  login: async (datos) => {
    set({ cargando: true, error: null });

    try {
      const respuesta = await iniciarSesion(datos);
      const role = obtenerRol(respuesta.token);

      localStorage.setItem("token", respuesta.token);

      set({
        token: respuesta.token,
        role,
        error: null,

        // Temporalmente usamos el correo del inicio de sesión.
        usuario: {
          ...usuarioInicial,
          email: datos.email,
        },
      });
    } catch (error: any) {
      const mensaje =
        error.response?.data?.message ?? "No fue posible iniciar sesión.";

      set({ error: mensaje });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  register: async (datos) => {
    set({ cargando: true, error: null });

    try {
      await registrarUsuario(datos);
    } catch (error: any) {
      const mensaje =
        error.response?.data?.message ?? "No fue posible registrar el usuario.";

      set({ error: mensaje });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      token: null,
      role: null,
      error: null,
      usuario: { ...usuarioInicial },
    });
  },

  limpiarError: () => set({ error: null }),

  actualizarUsuario: (datos) =>
    set((state) => ({
      usuario: {
        ...state.usuario,
        ...datos,
      },
    })),
}));
