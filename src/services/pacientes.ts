import { api } from "../lib/axios";
import type { Paciente } from "../types/pacientes";
import type { PacienteFormulario } from "../schemas/paciente.schema";

export const create = (data: PacienteFormulario) =>
  api.post<Paciente>("/pacientes", data);

export const update = (id: string, data: Partial<PacienteFormulario>) =>
  api.patch<Paciente>(`/pacientes/ById/${id}`, data);

export const remove = (id: string) => api.delete(`/pacientes/ById/${id}`);
