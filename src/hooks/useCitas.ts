import { useEffect } from "react";
import { useCitasStore } from "../stores/useCitasStore";

export function useCitas() {
  // ==============================
  // Estado de citas
  // ==============================

  const citas = useCitasStore((state) => state.citas);

  const citaSeleccionada = useCitasStore((state) => state.citaSeleccionada);

  const cargando = useCitasStore((state) => state.cargando);

  const error = useCitasStore((state) => state.error);

  // ==============================
  // Acciones del store
  // ==============================

  const cargarCitas = useCitasStore((state) => state.cargarCitas);

  const agregarCita = useCitasStore((state) => state.agregarCita);

  const seleccionarCita = useCitasStore((state) => state.seleccionarCita);

  const limpiarError = useCitasStore((state) => state.limpiarError);

  // ==============================
  // Carga inicial
  // ==============================

  useEffect(() => {
    void cargarCitas().catch(() => undefined);
  }, [cargarCitas]);

  // ==============================
  // Retorno del Custom Hook
  // ==============================

  return {
    citas,
    citaSeleccionada,
    cargando,
    error,
    cargarCitas,
    agregarCita,
    seleccionarCita,
    limpiarError,
  };
}
