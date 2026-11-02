import { api } from "../lib/axios";
import type { LoginDTO, LoginResponse } from "../types/auth";

export const iniciarSesion = async (
  datos: LoginDTO,
): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>("/auth/login", datos);

  return data;
};
/*
export async function registrarUsuario(datos: RegisterDTO): Promise<void> {
  await api.post("/auth/register", datos);
}
*/
export async function actualizarPerfil(formData: FormData) {
  const respuesta = await api.put("/auth/perfil", formData);

  return respuesta.data;
}
