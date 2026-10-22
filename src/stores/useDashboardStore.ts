import { create } from "zustand";
import { obtenerMetricas, type MetricasDashboard } from "../services/dashboard";

interface DashboardState extends MetricasDashboard {
  cargando: boolean;
  error: string | null;
  cargarMetricas: () => Promise<void>;
  limpiarError: () => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  totalMedicos: 0,
  citasProgramadas: 0,
  completadasHoy: 0,

  cargando: false,
  error: null,

  cargarMetricas: async () => {
    set({ cargando: true, error: null });

    try {
      const metricas = await obtenerMetricas();

      set({
        ...metricas,
        error: null,
      });
    } catch (error) {
      set({
        error: "No fue posible cargar las métricas.",
      });

      throw error;
    } finally {
      set({ cargando: false });
    }
  },

  limpiarError: () => {
    set({ error: null });
  },
}));
