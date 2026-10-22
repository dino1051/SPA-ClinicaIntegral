import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { api } from "../lib/axios";
import { useMemo, useState, useEffect } from "react";
import { PatientFormModal } from "../components/patients/PatientFormModal";
import type { Paciente } from "../types/pacientes";
import { CardMetrica } from "../components/MetricCard";
import { PatientFilters } from "../components/patients/PatientFilters";
import { PatientTable } from "../components/patients/PatientTable";
import { PacienteDetallePage } from "./PacienteDetallePage";
import { create, update } from "../types/pacientes";
import type { PacienteFormulario } from "../schemas/paciente.schema";
import toast from "react-hot-toast";
import { extraerMensajeError } from "../lib/errorHandler";

export function PacientesPage() {
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<Paciente | null>(null);

  const [modalFormularioAbierto, setModalFormularioAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("todos");
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [totalPacientes, setTotalPacientes] = useState<number | null>(null);
  const [totalMedicos, setTotalMedicos] = useState<number | null>(null);
  const [citasProgramadas, setCitasProgramadas] = useState<number | null>(null);
  const [completadasHoy, setCompletadasHoy] = useState<number | null>(null);
  // Obtener las especialidades que existen en los datos.
  const navigate = useNavigate();

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
        String(paciente.id_paciente).toLowerCase().includes(termino);

      const coincideEstado =
        estado === "todos" ||
        (estado === "activo" && paciente.activo === true) ||
        (estado === "inactivo" && paciente.activo === false);

      return coincideBusqueda && coincideEstado;
    });
  }, [pacientes, busqueda, estado]);

  function limpiarFiltros() {
    setBusqueda("");
    setEstado("todos");
  }

  function verPaciente(paciente: Paciente) {
    navigate(`/pacientes/byid/${paciente.id_paciente}`);
  }

  function editarPaciente(paciente: Paciente) {
    setPacienteSeleccionado(paciente);
    setModalFormularioAbierto(true);
  }
  async function guardarPaciente(datos: PacienteFormulario) {
    try {
      if (pacienteSeleccionado) {
        await update(pacienteSeleccionado.id_paciente, datos);
      } else {
        await create(datos);
      }

      await cargarPacientes();

      setPacienteSeleccionado(null);
      setModalFormularioAbierto(false);
      toast.success("Paciente registrado");
    } catch (error) {
      toast.error(extraerMensajeError(error));
      if (error && typeof error === "object" && "response" in error) {
        console.error("Respuesta del backend:", error.response);
      }
    }
  }
  function eliminarPaciente(paciente: Paciente) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar a ${paciente.nombre} ${paciente.apellido}?`,
    );

    if (!confirmar) return;

    setPacientes((actuales) =>
      actuales.filter((p) => p.id_paciente !== paciente.id_paciente),
    );

    // Si el paciente eliminado estaba seleccionado, limpiamos la selección.
    setPacienteSeleccionado((actual) =>
      actual?.id_paciente === paciente.id_paciente ? null : actual,
    );
  }

  const cargarPacientes = async () => {
    setCargando(true);
    setError(false);

    try {
      const res = await api.get("/pacientes");

      const lista: Paciente[] = Array.isArray(res.data)
        ? res.data
        : res.data.data;

      setPacientes(lista);

      const total = Array.isArray(res.data) ? res.data.length : res.data.total;

      setTotalPacientes(total);
    } catch (error: unknown) {
      setError(true);
      toast.error(extraerMensajeError(error));
    } finally {
      setCargando(false);
    }
  };
  useEffect(() => {
    api
      .get("/doctores")
      .then((res) => {
        setTotalMedicos(
          Array.isArray(res.data) ? res.data.length : res.data.total,
        );
      })
      .catch((error) => {
        console.error("Error al cargar médicos:", error);
      });

    api
      .get("/citas?estado=Programada")
      .then((res) => {
        setCitasProgramadas(
          Array.isArray(res.data) ? res.data.length : res.data.total,
        );
      })
      .catch((error) => {
        console.error("Error al cargar citas programadas:", error);
      });

    api
      .get("/citas?estado=Completada")
      .then((res) => {
        setCompletadasHoy(
          Array.isArray(res.data) ? res.data.length : res.data.total,
        );
      })
      .catch((error) => {
        console.error("Error al cargar citas completadas:", error);
      });
  }, []);

  useEffect(() => {
    void cargarPacientes();
  }, []);
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
      <PatientFilters
        busqueda={busqueda}
        estado={estado}
        onBusquedaChange={setBusqueda}
        onEstadoChange={setEstado}
        onLimpiar={limpiarFiltros}
      />
      {/* Tabla de pacientes */}
      {cargando ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div
            className="size-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
            role="status"
            aria-label="Cargando pacientes"
          />
          <p className="text-sm text-slate-500">Cargando pacientes...</p>
        </div>
      ) : error ? (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-center"
          role="alert"
        >
          <p className="font-semibold text-red-700">
            No se pudieron cargar los pacientes.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Verifica tu conexión e inténtalo de nuevo.
          </p>

          <button
            type="button"
            onClick={() => void cargarPacientes()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
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
            onEliminarPaciente={eliminarPaciente}
            onRestablecerFiltros={limpiarFiltros}
          />
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
    </section>
  );
}
