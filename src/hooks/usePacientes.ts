import { useEffect } from "react";
import { usePacientesStore } from "../stores/usePacientesStore";
import type { PacienteFormulario } from "../schemas/paciente.schema";

export function usePacientes() {
  // ==============================
  // Estado de pacientes
  // ==============================
  const pacientes = usePacientesStore((state) => state.pacientes);
  const totalPacientes = usePacientesStore((state) => state.totalPacientes);
  const cargando = usePacientesStore((state) => state.cargando);
  const error = usePacientesStore((state) => state.error);

  // ==============================
  // Acciones del store
  // ==============================
  const cargarPacientes = usePacientesStore((state) => state.cargarPacientes);

  const guardarPaciente = usePacientesStore((state) => state.guardarPaciente);

  const eliminarPaciente = usePacientesStore((state) => state.eliminarPaciente);

  // ==============================
  // Acciones para la página
  // ==============================
  const crear = (datos: PacienteFormulario) => {
    return guardarPaciente(datos);
  };

  const actualizar = (id: number, datos: PacienteFormulario) => {
    return guardarPaciente(datos, id);
  };

  const eliminar = (id: number) => {
    return eliminarPaciente(id);
  };

  // ==============================
  // Carga inicial
  // ==============================
  useEffect(() => {
    void cargarPacientes().catch(() => undefined);
  }, [cargarPacientes]);

  // ==============================
  // Retorno del Custom Hook
  // ==============================
  return {
    pacientes,
    totalPacientes,
    cargando,
    error,
    cargarPacientes,
    crear,
    actualizar,
    eliminar,
  };
}
