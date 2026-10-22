import { create } from "zustand";

interface PacientesFiltrosState {
  busqueda: string;
  estado: string;
  setBusqueda: (busqueda: string) => void;
  setEstado: (estado: string) => void;
  limpiarFiltros: () => void;
}

export const usePacientesFiltrosStore = create<PacientesFiltrosState>()(
  (set) => ({
    busqueda: "",
    estado: "todos",

    setBusqueda: (busqueda) => set({ busqueda }),

    setEstado: (estado) => set({ estado }),

    limpiarFiltros: () =>
      set({
        busqueda: "",
        estado: "todos",
      }),
  }),
);
