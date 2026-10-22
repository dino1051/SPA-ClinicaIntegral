export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface Cita {
  id_cita: number;
  fecha: string;
  estado: EstadoCita;
  id_paciente: number;
  id_doctor: number;
}

export interface CrearCitaPayload {
  fecha: string;
  id_paciente: number;
  id_doctor: number;
}
