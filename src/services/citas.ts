import { api } from "../lib/axios";
import type { Cita, CrearCitaPayload, EstadoCita } from "../types/citas";

interface RespuestaPaginada {
  data: Cita[];
  total?: number;
}

export async function obtenerCitas(estado?: EstadoCita): Promise<Cita[]> {
  const respuesta = await api.get<Cita[] | RespuestaPaginada>("/citas", {
    params: estado ? { estado } : undefined,
  });

  const datos = respuesta.data;

  return Array.isArray(datos) ? datos : datos.data;
}

export async function crearCita(datos: CrearCitaPayload): Promise<Cita> {
  const respuesta = await api.post<Cita>("/citas", datos);

  return respuesta.data;
}
