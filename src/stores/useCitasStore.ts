import { create } from "zustand";
import { obtenerCitas, crearCita } from "../services/citas";
import type { Cita, CrearCitaPayload, EstadoCita } from "../types/citas";

interface CitasState {
  citas: Cita[];
  citaSeleccionada: Cita | null;
  cargando: boolean;
  error: string | null;

  cargarCitas: (estado?: EstadoCita) => Promise<void>;
  agregarCita: (datos: CrearCitaPayload) => Promise<Cita>;
  seleccionarCita: (cita: Cita | null) => void;
  limpiarError: () => void;
}

export const useCitasStore = create<CitasState>()((set) => ({
  citas: [],
  citaSeleccionada: null,
  cargando: false,
  error: null,

  cargarCitas: async (estado) => {
    set({ cargando: true, error: null });

    try {
      const citas = await obtenerCitas(estado);

      set({ citas });
    } catch (error) {
      set({ error: "No fue posible cargar las citas." });
      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  agregarCita: async (datos) => {
    set({ error: null });

    try {
      const nuevaCita = await crearCita(datos);

      set((state) => ({
        citas: [...state.citas, nuevaCita],
      }));

      return nuevaCita;
    } catch (error) {
      set({ error: "No fue posible registrar la cita." });
      throw error;
    }
  },

  seleccionarCita: (cita) => {
    set({ citaSeleccionada: cita });
  },

  limpiarError: () => {
    set({ error: null });
  },
}));
