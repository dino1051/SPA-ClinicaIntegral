import { api } from "../lib/axios";

export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface ActualizarEstadoCitaDTO {
  estado: EstadoCita;
}

export const updateEstado = (id: number, estado: EstadoCita) =>
  api.patch<void>(`/citas/${id}/estado`, {
    estado,
  });
