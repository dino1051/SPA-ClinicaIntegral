import { create } from "zustand";
import {
  obtenerPacientes,
  crearPaciente,
  actualizarPaciente,
  eliminarPacienteApi,
} from "../services/pacientes";
import type { Paciente } from "../types/pacientes";
import type { PacienteFormulario } from "../schemas/paciente.schema";

interface PacientesState {
  pacientes: Paciente[];
  totalPacientes: number | null;
  cargando: boolean;
  error: boolean;

  cargarPacientes: () => Promise<void>;
  guardarPaciente: (datos: PacienteFormulario, id?: number) => Promise<void>;
  eliminarPaciente: (id: number) => Promise<void>;
}

export const usePacientesStore = create<PacientesState>()((set) => ({
  pacientes: [],
  totalPacientes: null,
  cargando: false,
  error: false,

  cargarPacientes: async () => {
    set({ cargando: true, error: false });

    try {
      const resultado = await obtenerPacientes();

      set({
        pacientes: resultado.pacientes,
        totalPacientes: resultado.total,
      });
    } catch (error) {
      set({ error: true });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  guardarPaciente: async (datos, id) => {
    if (id !== undefined) {
      await actualizarPaciente(id, datos);
    } else {
      await crearPaciente(datos);
    }

    await obtenerPacientes().then((resultado) => {
      set({
        pacientes: resultado.pacientes,
        totalPacientes: resultado.total,
        error: false,
      });
    });
  },

  eliminarPaciente: async (id) => {
    await eliminarPacienteApi(id);

    set((state) => ({
      pacientes: state.pacientes.filter(
        (paciente) => paciente.id_paciente !== id,
      ),
      totalPacientes:
        state.totalPacientes === null
          ? null
          : Math.max(0, state.totalPacientes - 1),
    }));
  },
}));
