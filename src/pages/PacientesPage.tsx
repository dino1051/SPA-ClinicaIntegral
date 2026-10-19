import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

import { useMemo, useState } from "react";
import { PatientDetailsModal } from "../components/patients/PatientiDetailsModal";
import { PatientFormModal } from "../components/patients/PatientFormModal";
import type { Paciente } from "../types/pacientes";
import { pacientesIniciales } from "../data/pacientesData";
import { CardMetrica } from "../components/MetricCard";
import { PatientFilters } from "../components/patients/PatientFilters";
import { PatientTable } from "../components/patients/PatientTable";

export function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>(pacientesIniciales);
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<Paciente | null>(null);

  const [modalDetallesAbierto, setModalDetallesAbierto] = useState(false);
  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("todos");
  const [especialidad, setEspecialidad] = useState("todas");

  // Obtener las especialidades que existen en los datos.
  const especialidades = useMemo(() => {
    return [
      ...new Set(
        pacientes
          .map((paciente) => paciente.especialidadAsignada)
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b, "es"));
  }, [pacientes]);
  // Aplicar los filtros.
  const pacientesFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();

    return pacientes.filter((paciente) => {
      const nombreCompleto =
        `${paciente.nombre} ${paciente.apellido}`.toLowerCase();

      const coincideBusqueda =
        nombreCompleto.includes(termino) ||
        paciente.email.toLowerCase().includes(termino) ||
        paciente.telefono.toLowerCase().includes(termino) ||
        paciente.id.toLowerCase().includes(termino);

      const coincideEstado = estado === "todos" || paciente.estado === estado;

      const coincideEspecialidad =
        especialidad === "todas" ||
        paciente.especialidadAsignada === especialidad;

      return coincideBusqueda && coincideEstado && coincideEspecialidad;
    });
  }, [pacientes, busqueda, estado, especialidad]);

  function limpiarFiltros() {
    setBusqueda("");
    setEstado("todos");
    setEspecialidad("todas");
  }

  function verPaciente(paciente: Paciente) {
    setPacienteSeleccionado(paciente);
    setModalDetallesAbierto(true);
  }

  function editarPaciente(paciente: Paciente) {
    setPacienteSeleccionado(paciente);
    setModalDetallesAbierto(false);
    setModalFormularioAbierto(true);
  }
  function guardarPaciente(pacienteActualizado: Paciente) {
    setPacientes((actuales) => {
      const existe = actuales.some((p) => p.id === pacienteActualizado.id);

      if (existe) {
        return actuales.map((p) =>
          p.id === pacienteActualizado.id ? pacienteActualizado : p,
        );
      }

      return [...actuales, pacienteActualizado];
    });

    setPacienteSeleccionado(null);
    setModalFormularioAbierto(false);
  }
  function eliminarPaciente(paciente: Paciente) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar a ${paciente.nombre} ${paciente.apellido}?`,
    );

    if (!confirmar) return;

    setPacientes((actuales) => actuales.filter((p) => p.id !== paciente.id));

    // Si el paciente eliminado estaba seleccionado, limpiamos la selección.
    setPacienteSeleccionado((actual) =>
      actual?.id === paciente.id ? null : actual,
    );
  }

  const totalPacientes = pacientes.length;

  const pacientesActivos = pacientes.filter(
    (paciente) => paciente.estado === "activo",
  ).length;

  const pacientesInactivos = pacientes.filter(
    (paciente) => paciente.estado === "inactivo",
  ).length;

  const pacientesEnEspera = pacientes.filter(
    (paciente) => paciente.estado === "en_espera",
  ).length;
  {
    modalDetallesAbierto && (
      <PatientDetailsModal
        paciente={pacienteSeleccionado}
        onCerrar={() => setModalDetallesAbierto(false)}
        onEditar={editarPaciente}
      />
    );
  }

  {
    modalFormularioAbierto && (
      <PatientFormModal
        paciente={pacienteSeleccionado}
        especialidades={especialidades}
        onCerrar={() => {
          setModalFormularioAbierto(false);
          setPacienteSeleccionado(null);
        }}
        onGuardar={guardarPaciente}
      />
    );
  }
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pacientes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra y consulta la información de tus pacientes.
          </p>
        </div>

        <Link
          to="/citas/nueva"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <UserPlus size={18} />
          Agendar cita
        </Link>
      </div>

      {/* Filtros */}
      <PatientFilters
        busqueda={busqueda}
        estado={estado}
        especialidad={especialidad}
        especialidades={especialidades}
        onBusquedaChange={setBusqueda}
        onEstadoChange={setEstado}
        onEspecialidadChange={setEspecialidad}
        onLimpiar={limpiarFiltros}
      />

      {/* Tabla de pacientes */}
      <PatientTable
        pacientes={pacientesFiltrados}
        onVerPaciente={verPaciente}
        onEditarPaciente={editarPaciente}
        onEliminarPaciente={eliminarPaciente}
        onRestablecerFiltros={limpiarFiltros}
      />

      {/* Métricas */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <CardMetrica
          id="total"
          titulo="Total de pacientes"
          valor={totalPacientes}
          descripcion="Pacientes registrados"
          tendencia="positiva"
          icono="groups"
        />

        <CardMetrica
          id="activos"
          titulo="Pacientes activos"
          valor={pacientesActivos}
          descripcion="Pacientes con estado activo"
          tendencia="positiva"
          icono="person_check"
        />

        <CardMetrica
          id="inactivos"
          titulo="Pacientes inactivos"
          valor={pacientesInactivos}
          descripcion="Pacientes con estado inactivo"
          tendencia="negativa"
          icono="person_off"
        />

        <CardMetrica
          id="espera"
          titulo="Pacientes en espera"
          valor={pacientesEnEspera}
          descripcion="Pacientes pendientes de atención"
          tendencia="neutra"
          icono="hourglass_empty"
        />
      </div>

      {/* Modal para consultar un paciente */}
      {modalDetallesAbierto && pacienteSeleccionado && (
        <PatientDetailsModal
          paciente={pacienteSeleccionado}
          onCerrar={() => setModalDetallesAbierto(false)}
          onEditar={editarPaciente}
        />
      )}
    </section>
  );
}
