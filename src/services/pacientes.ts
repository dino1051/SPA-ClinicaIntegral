import { api } from "../lib/axios";
import type { PacienteFormulario } from "../schemas/paciente.schema";
import type { Paciente } from "../types/pacientes";

interface RespuestaPacientes {
  pacientes: Paciente[];
  total: number;
}

export async function obtenerPacientes(): Promise<RespuestaPacientes> {
  const respuesta = await api.get("/pacientes");
  const datos = respuesta.data;

  const pacientes: Paciente[] = Array.isArray(datos) ? datos : datos.data;

  const total: number = Array.isArray(datos)
    ? datos.length
    : (datos.total ?? pacientes.length);

  return { pacientes, total };
}

export function crearPaciente(datos: PacienteFormulario) {
  return api.post<Paciente>("/pacientes", datos);
}

export function actualizarPaciente(
  id: number,
  datos: Partial<PacienteFormulario>,
) {
  return api.patch<Paciente>(`/pacientes/ById/${id}`, datos);
}

export function eliminarPacienteApi(id: number) {
  return api.delete(`/pacientes/ById/${id}`);
}
