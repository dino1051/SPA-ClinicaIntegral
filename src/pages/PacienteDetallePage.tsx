import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";
import { api } from "../lib/axios";
import type { Paciente } from "../types/pacientes";

export function PacienteDetallePage() {
  const { id } = useParams<{ id: string }>();

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

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

    cargarPaciente();

    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-500">Cargando paciente...</p>
      </section>
    );
  }

  if (error || !paciente) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <h2 className="text-xl font-bold">Paciente no encontrado</h2>

        <p className="mt-2 text-slate-500">
          No encontramos un paciente con ese identificador.
        </p>

        <Link
          to="/pacientes"
          className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} />
          Volver a pacientes
        </Link>
      </section>
    );
  }
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
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-50 p-4 text-blue-600">
            <UserRound size={30} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {paciente.nombre} {paciente.apellido}
            </h2>

            <p className="text-sm text-slate-500">ID: {paciente.id_paciente}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Correo electrónico</p>
            <p className="mt-1 font-medium">{paciente.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Fecha de nacimiento</p>
            <p className="mt-1 font-medium">{paciente.fechaNacimiento}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Teléfono</p>
            <p className="mt-1 font-medium">{paciente.telefono}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Estado</p>

            <span
              className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                paciente.activo
                  ? "bg-secondary-fixed/40 text-secondary"
                  : "bg-surface-container text-outline"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  paciente.activo ? "bg-secondary" : "bg-outline"
                }`}
              />

              {paciente.activo ? "Activo" : "Inactivo"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
