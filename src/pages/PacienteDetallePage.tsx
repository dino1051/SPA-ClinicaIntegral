import { Link, useParams } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";
import { pacientesIniciales } from "../data/pacientesData";

export function PacienteDetallePage() {
  const { id } = useParams<{ id: string }>();

  const paciente = pacientesIniciales.find((p) => p.id === id);

  if (!paciente) {
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
            <p className="text-sm text-slate-500">ID: {paciente.id}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Correo electrónico</p>
            <p className="mt-1 font-medium">{paciente.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Teléfono</p>
            <p className="mt-1 font-medium">{paciente.telefono}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Especialidad asignada</p>
            <p className="mt-1 font-medium">{paciente.especialidadAsignada}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Última cita</p>
            <p className="mt-1 font-medium">
              {paciente.ultimaCita || "Sin citas registradas"}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Estado</p>
            <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium capitalize text-blue-700">
              {paciente.estado.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
