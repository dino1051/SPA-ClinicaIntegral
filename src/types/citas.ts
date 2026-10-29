export type EstadoCita = "PROGRAMADA" | "COMPLETADA" | "CANCELADA";

export interface PacienteCita {
  id_paciente: number;
  nombre: string;
  apellido: string;
}

export interface DoctorCita {
  id_doctor: number;
  nombre: string;
  apellido: string;
}

export interface Cita {
  id_cita: number;
  fecha: string;
  estado: EstadoCita;
  id_paciente: number;
  id_doctor: number;
  paciente: PacienteCita;
  doctor: DoctorCita;
}

export interface CrearCitaPayload {
  fecha: string;
  id_paciente: number;
  id_doctor: number;
}
