import { useEffect, useOptimistic, useState, useTransition } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, UserRound, Power } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../lib/axios";
import type { Paciente } from "../types/pacientes";
import Spinner from "../components/ui/Spinner";
import EstadoVacio from "../components/ui/EstadoVacio";
import AlertaBanner from "../components/ui/AlertaBanner";

export function PacienteDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [errorActualizacion, setErrorActualizacion] = useState("");

  const [isPending, startTransition] = useTransition();

  // Estado optimista: modifica visualmente el estado del paciente.
  const [pacienteOptimista, setPacienteOptimista] = useOptimistic(
    paciente,
    (estadoActual, nuevoActivo: boolean) =>
      estadoActual ? { ...estadoActual, activo: nuevoActivo } : estadoActual,
  );

  // Obtener información del paciente.
  useEffect(() => {
    if (!id) {
      setCargando(false);
      setError(true);
      return;
    }

    let activo = true;

    const cargarPaciente = async () => {
      setCargando(true);
      setError(false);
      setPaciente(null);

      try {
        const res = await api.get<Paciente>(`/pacientes/Byid/${id}`);

        if (activo) {
          setPaciente(res.data);
        }
      } catch (error) {
        console.error("Error al cargar el paciente:", error);

        if (activo) {
          setError(true);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    void cargarPaciente();

    return () => {
      activo = false;
    };
  }, [id]);

  // Cambiar estado activo/inactivo usando PATCH.
  const cambiarEstado = () => {
    if (!paciente || !id || isPending) return;

    const nuevoActivo = !paciente.activo;

    setErrorActualizacion("");

    startTransition(async () => {
      // Actualización visual inmediata.
      setPacienteOptimista(nuevoActivo);

      try {
        const res = await api.patch<Paciente>(`/pacientes/Byid/${id}`, {
          activo: nuevoActivo,
        });

        // Guardamos la respuesta confirmada por el servidor.
        setPaciente(res.data);

        toast.success(
          nuevoActivo
            ? "Paciente activado correctamente"
            : "Paciente desactivado correctamente",
        );
      } catch (error) {
        console.error("Error al actualizar el paciente:", error);

        setErrorActualizacion(
          "No fue posible actualizar el estado del paciente. Intenta nuevamente.",
        );

        toast.error("No se pudo actualizar el paciente");
      }
    });
  };

  // Estado de carga.
  if (cargando) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <Spinner mensaje="Cargando información del paciente..." />
      </section>
    );
  }

  // Estado cuando no existe el paciente.
  if (error || !pacienteOptimista) {
    return (
      <EstadoVacio
        titulo="Paciente no encontrado"
        descripcion="No encontramos un paciente con ese identificador. Comprueba que la dirección sea correcta."
        accion={{
          label: "Volver a pacientes",
          onClick: () => navigate("/pacientes"),
        }}
      />
    );
  }

  const pacienteActual = pacienteOptimista;

  return (
    <section className="space-y-6">
      <Link
        to="/pacientes"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Volver a pacientes
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {/* Encabezado del paciente */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-50 p-4 text-blue-600">
              <UserRound size={30} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                {pacienteActual.nombre} {pacienteActual.apellido}
              </h2>

              <p className="text-sm text-slate-500">
                ID: {pacienteActual.id_paciente}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={cambiarEstado}
            disabled={isPending}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              pacienteActual.activo
                ? "bg-red-50 text-red-700 hover:bg-red-100"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            <Power size={18} />

            {isPending
              ? "Actualizando..."
              : pacienteActual.activo
                ? "Desactivar paciente"
                : "Activar paciente"}
          </button>
        </div>

        {/* Error al actualizar */}
        {errorActualizacion && (
          <div className="mt-5">
            <AlertaBanner
              tipo="error"
              titulo="Error al actualizar"
              mensaje={errorActualizacion}
            />
          </div>
        )}

        {/* Información del paciente */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Correo electrónico</p>
            <p className="mt-1 font-medium">{pacienteActual.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Fecha de nacimiento</p>
            <p className="mt-1 font-medium">{pacienteActual.fechaNacimiento}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Teléfono</p>
            <p className="mt-1 font-medium">{pacienteActual.telefono}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Estado</p>

            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                pacienteActual.activo
                  ? "bg-secondary-fixed/40 text-secondary"
                  : "bg-surface-container text-outline"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  pacienteActual.activo ? "bg-secondary" : "bg-outline"
                }`}
              />

              {pacienteActual.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
