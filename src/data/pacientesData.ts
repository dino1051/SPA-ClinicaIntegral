import type { Paciente } from "../types/pacientes";

export const pacientesIniciales: Paciente[] = [
  {
    id: "PAC-1001",
    nombre: "Laura",
    apellido: "Martínez Ruiz",
    email: "laura.martinez@email.com",
    telefono: "612345678",
    especialidadAsignada: "Cardiología",
    ultimaCita: "2026-05-10",
    estado: "activo",
  },
  {
    id: "PAC-1002",
    nombre: "Alejandro",
    apellido: "Sanz Navarro",
    email: "alejandro.sanz@email.com",
    telefono: "622987654",
    especialidadAsignada: "Pediatría",
    ultimaCita: "2026-04-22",
    estado: "en_espera",
  },
];
