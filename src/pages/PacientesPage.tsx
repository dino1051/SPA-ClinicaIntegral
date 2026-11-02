import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import {
  useMemo,
  useState,
  useEffect,
  useOptimistic,
  startTransition,
} from "react";
import { PatientFormModal } from "../components/patients/PatientFormModal";
import type { Paciente } from "../types/pacientes";
import { CardMetrica } from "../components/MetricCard";
import { PatientFilters } from "../components/patients/PatientFilters";
import { PatientTable } from "../components/patients/PatientTable";
import type { PacienteFormulario } from "../schemas/paciente.schema";
import toast from "react-hot-toast";
import { extraerMensajeError } from "../lib/errorHandler";
import { usePacientesStore } from "../stores/usePacientesStore";
import { useDashboardStore } from "../stores/useDashboardStore";
import { useDebounce } from "../hooks/useDebounce";
import { usePacientesFiltrosStore } from "../stores/usePacientesFiltrosStore";
import EstadoVacio from "../components/ui/EstadoVacio";
import AlertaBanner from "../components/ui/AlertaBanner";
import ModalConfirmacion from "../components/ui/ModalConfirmacion";
import SkeletonPacienteRow from "../components/ui/skeletons/SkeletonPacienteRow";

export function PacientesPage() {
  const busqueda = usePacientesFiltrosStore((state) => state.busqueda);
  const estado = usePacientesFiltrosStore((state) => state.estado);
  const setBusqueda = usePacientesFiltrosStore((state) => state.setBusqueda);
  const setEstado = usePacientesFiltrosStore((state) => state.setEstado);

  const limpiarFiltros = usePacientesFiltrosStore(
    (state) => state.limpiarFiltros,
  );

  const busquedaDebounced = useDebounce(busqueda, 400);
  const pacientes = usePacientesStore((state) => state.pacientes);
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<Paciente | null>(null);

  const cargando = usePacientesStore((state) => state.cargando);
  const error = usePacientesStore((state) => state.error);
  const totalPacientes = usePacientesStore((state) => state.totalPacientes);
  const cargarPacientes = usePacientesStore((state) => state.cargarPacientes);

  const guardarPacienteEnStore = usePacientesStore(
    (state) => state.guardarPaciente,
  );

  const eliminarPacienteDelStore = usePacientesStore(
    (state) => state.eliminarPaciente,
  );
  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const totalMedicos = useDashboardStore((state) => state.totalMedicos);

  const citasProgramadas = useDashboardStore((state) => state.citasProgramadas);

  const completadasHoy = useDashboardStore((state) => state.completadasHoy);

  const cargarMetricas = useDashboardStore((state) => state.cargarMetricas);
  const [pacientesOptimistas, actualizarOptimista] = useOptimistic(
    pacientes,
    (
      listaActual: Paciente[],
      accion: {
        tipo: "agregar" | "actualizar";
        paciente: Paciente;
      },
    ) => {
      if (accion.tipo === "agregar") {
        return [accion.paciente, ...listaActual];
      }

      return listaActual.map((paciente) =>
        paciente.id_paciente === accion.paciente.id_paciente
          ? accion.paciente
          : paciente,
      );
    },
  );
  const navigate = useNavigate();
  const [pacienteAEliminar, setPacienteAEliminar] = useState<Paciente | null>(
    null,
  );

  const [eliminando, setEliminando] = useState(false);
  // Aplicar los filtros.

  const pacientesFiltrados = useMemo(() => {
    const termino = busquedaDebounced.trim().toLowerCase();

    return pacientesOptimistas.filter((paciente) => {
      const nombreCompleto =
        `${paciente.nombre} ${paciente.apellido}`.toLowerCase();

      const coincideBusqueda =
        nombreCompleto.includes(termino) ||
        paciente.email.toLowerCase().includes(termino) ||
        paciente.telefono.toLowerCase().includes(termino) ||
        String(paciente.id_paciente).includes(termino);

      const coincideEstado =
        estado === "todos" ||
        (estado === "activo" && paciente.activo === true) ||
        (estado === "inactivo" && paciente.activo === false);

      return coincideBusqueda && coincideEstado;
    });
  }, [pacientesOptimistas, busquedaDebounced, estado]);

  function verPaciente(paciente: Paciente) {
    navigate(`/pacientes/byid/${paciente.id_paciente}`);
  }

  function editarPaciente(paciente: Paciente) {
    setPacienteSeleccionado(paciente);
    setModalFormularioAbierto(true);
  }

  async function guardarPaciente(datos: PacienteFormulario) {
    const esEdicion = pacienteSeleccionado !== null;

    const pacienteOptimista: Paciente = esEdicion
      ? {
          ...pacienteSeleccionado,
          ...datos,
        }
      : {
          ...datos,
          id_paciente: -Date.now(),
          activo: true,
        };

    startTransition(async () => {
      actualizarOptimista({
        tipo: esEdicion ? "actualizar" : "agregar",
        paciente: pacienteOptimista,
      });

      try {
        await guardarPacienteEnStore(datos, pacienteSeleccionado?.id_paciente);

        setPacienteSeleccionado(null);
        setModalFormularioAbierto(false);

        toast.success(
          esEdicion
            ? "Paciente actualizado correctamente"
            : "Paciente registrado correctamente",
        );
      } catch (error) {
        toast.error(extraerMensajeError(error));
      }
    });
  }

  // Abre el modal de confirmación
  function solicitarEliminarPaciente(paciente: Paciente) {
    setPacienteAEliminar(paciente);
  }

  // Ejecuta la eliminación
  async function confirmarEliminarPaciente() {
    if (!pacienteAEliminar) return;

    try {
      setEliminando(true);

      await eliminarPacienteDelStore(pacienteAEliminar.id_paciente);

      setPacienteSeleccionado((actual) =>
        actual?.id_paciente === pacienteAEliminar.id_paciente ? null : actual,
      );

      toast.success("Paciente eliminado correctamente");

      setPacienteAEliminar(null);
    } catch (error) {
      toast.error(extraerMensajeError(error));
    } finally {
      setEliminando(false);
    }
  }

  useEffect(() => {
    void cargarPacientes().catch((error: unknown) => {
      toast.error(extraerMensajeError(error));
    });
  }, [cargarPacientes]);

  useEffect(() => {
    void cargarMetricas().catch((error: unknown) => {
      console.error("Error al cargar las métricas:", error);
      toast.error("No fue posible cargar las métricas.");
    });
  }, [cargarMetricas]);
  /*
  useEffect(() => {
    void cargarPacientes();
  }, []);
  */
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pacientes</h2>
          <p className="mt-1 text-sm text-slate-500">
            Administra y consulta la información de tus pacientes.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setPacienteSeleccionado(null);
              setModalFormularioAbierto(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <UserPlus size={18} />
            Nuevo paciente
          </button>

          <Link
            to="/citas/nueva"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <UserPlus size={18} />
            Agendar cita
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="relative w-full max-w-md"></div>
      <PatientFilters
        busqueda={busqueda}
        estado={estado}
        onBusquedaChange={setBusqueda}
        onEstadoChange={setEstado}
        onLimpiar={limpiarFiltros}
      />
      {/* Tabla de pacientes */}
      {cargando ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonPacienteRow key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="space-y-3">
          <AlertaBanner
            tipo="error"
            titulo="Error al cargar pacientes"
            mensaje="No se pudieron obtener los pacientes. Verifica tu conexión e inténtalo nuevamente."
          />

          <button
            type="button"
            onClick={() => void cargarPacientes()}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      ) : (
        <>
          {pacientesFiltrados.length === 0 ? (
            pacientes.length === 0 ? (
              <EstadoVacio
                titulo="No hay pacientes registrados"
                descripcion="Registra tu primer paciente para comenzar a gestionar sus citas."
                accion={{
                  label: "Agregar paciente",
                  onClick: () => {
                    setPacienteSeleccionado(null);
                    setModalFormularioAbierto(true);
                  },
                }}
              />
            ) : (
              <EstadoVacio
                titulo="No se encontraron pacientes"
                descripcion="No hay pacientes que coincidan con los filtros seleccionados."
                accion={{
                  label: "Limpiar filtros",
                  onClick: limpiarFiltros,
                }}
              />
            )
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-500">
                Mostrando {pacientesFiltrados.length} de{" "}
                {totalPacientes ?? pacientes.length} pacientes
              </p>

              <PatientTable
                pacientes={pacientesFiltrados}
                onVerPaciente={verPaciente}
                onEditarPaciente={editarPaciente}
                onEliminarPaciente={solicitarEliminarPaciente}
                onRestablecerFiltros={limpiarFiltros}
              />
            </>
          )}
        </>
      )}
      {/* Métricas */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        <CardMetrica
          id="pacientes"
          titulo="Pacientes"
          valor={totalPacientes ?? "..."}
          descripcion="Pacientes registrados"
          tendencia="neutra"
          icono="users"
        />

        <CardMetrica
          id="medicos"
          titulo="Médicos"
          valor={totalMedicos ?? "..."}
          descripcion="Médicos registrados"
          tendencia="neutra"
          icono="stethoscope"
        />

        <CardMetrica
          id="citas-programadas"
          titulo="Citas Programadas"
          valor={citasProgramadas ?? "..."}
          descripcion="Citas pendientes de realizar"
          tendencia="neutra"
          icono="calendar-clock"
        />

        <CardMetrica
          id="completadas-hoy"
          titulo="Completadas Hoy"
          valor={completadasHoy ?? "..."}
          descripcion="Citas completadas"
          tendencia="neutra"
          icono="calendar-check"
        />
      </div>
      {/* Modal para crear o editar pacientes */}
      {modalFormularioAbierto && (
        <PatientFormModal
          paciente={pacienteSeleccionado}
          onCerrar={() => {
            setModalFormularioAbierto(false);
            setPacienteSeleccionado(null);
          }}
          onGuardar={guardarPaciente}
        />
      )}
      <ModalConfirmacion
        abierto={pacienteAEliminar !== null}
        titulo="Eliminar paciente"
        mensaje={
          pacienteAEliminar
            ? `¿Estás seguro de que deseas eliminar a ${pacienteAEliminar.nombre} ${pacienteAEliminar.apellido}? Esta acción no se puede deshacer.`
            : ""
        }
        textoConfirmar="Eliminar paciente"
        cargando={eliminando}
        onConfirmar={confirmarEliminarPaciente}
        onCancelar={() => {
          if (!eliminando) {
            setPacienteAEliminar(null);
          }
        }}
      />
    </section>
  );
}
