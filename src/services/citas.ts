import { api } from "../lib/axios";
import type { Cita, CrearCitaPayload, EstadoCita } from "../types/citas.ts";

export async function obtenerCitas(estado?: EstadoCita): Promise<Cita[]> {
  const { data } = await api.get<Cita[]>("/citas", {
    params: estado ? { estado } : {},
  });

  return data;
}

export async function crearCita(datos: CrearCitaPayload): Promise<Cita> {
  const respuesta = await api.post<Cita>("/citas", datos);
  return respuesta.data;
}
