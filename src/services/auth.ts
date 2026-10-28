import { api } from "../lib/axios";
import type { LoginDTO, LoginResponse, RegisterDTO } from "../types/auth";

export async function iniciarSesion(datos: LoginDTO): Promise<LoginResponse> {
  const respuesta = await api.post<LoginResponse>("/auth/login", datos);

  return respuesta.data;
}

export async function registrarUsuario(datos: RegisterDTO): Promise<void> {
  await api.post("/auth/register", datos);
}

export async function actualizarPerfil(formData: FormData) {
  const respuesta = await api.put("/auth/perfil", formData);

  return respuesta.data;
}
