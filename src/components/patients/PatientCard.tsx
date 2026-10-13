import type { Paciente } from "../../types/pacientes";

interface PatientCardProps {
  paciente: Paciente;
  onVerPaciente: (paciente: Paciente) => void;
  onEditarPaciente: (paciente: Paciente) => void;
  onEliminarPaciente: (paciente: Paciente) => void;
}

const estados: Record<Paciente["estado"], string> = {
  activo: "Activo",
  inactivo: "Inactivo",
  en_espera: "En espera",
};

const coloresEstado: Record<Paciente["estado"], string> = {
  activo: "bg-emerald-500/15 text-emerald-400",
  inactivo: "bg-red-500/15 text-red-400",
  en_espera: "bg-amber-500/15 text-amber-400",
};

export function PatientCard({
  paciente,
  onVerPaciente,
  onEditarPaciente,
  onEliminarPaciente,
}: PatientCardProps) {
  const iniciales =
    `${paciente.nombre.charAt(0)}${paciente.apellido.charAt(0)}`.toUpperCase();

  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-5 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
      {/* Encabezado: avatar, nombre y estado */}
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
          {iniciales}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-white">
            {paciente.nombre} {paciente.apellido}
          </h3>

          <p className="mt-1 text-xs text-gray-400">ID: {paciente.id}</p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            coloresEstado[paciente.estado]
          }`}
        >
          {estados[paciente.estado]}
        </span>
      </div>

      {/* Información del paciente */}
      <div className="mt-5 flex-1 space-y-3">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-lg text-primary">
            mail
          </span>
          <p className="min-w-0 break-words text-sm text-gray-300">
            {paciente.email}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-lg text-primary">
            call
          </span>
          <p className="text-sm text-gray-300">
            {paciente.telefono || "Sin teléfono"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-lg text-primary">
            medical_services
          </span>
          <p className="text-sm text-gray-300">
            {paciente.especialidadAsignada || "Sin especialidad asignada"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-lg text-primary">
            calendar_month
          </span>
          <p className="text-sm text-gray-300">
            {paciente.ultimaCita || "Sin citas registradas"}
          </p>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-5 flex gap-2 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={() => onVerPaciente(paciente)}
          title="Ver detalles"
          aria-label={`Ver detalles de ${paciente.nombre}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-lg">visibility</span>
          Ver
        </button>

        <button
          type="button"
          onClick={() => onEditarPaciente(paciente)}
          title="Editar paciente"
          aria-label={`Editar a ${paciente.nombre}`}
          className="flex items-center justify-center rounded-xl border border-white/10 px-3 py-2 text-gray-200 transition-colors hover:bg-white/10"
        >
          <span className="material-symbols-outlined text-lg">edit</span>
        </button>

        <button
          type="button"
          onClick={() => onEliminarPaciente(paciente)}
          title="Eliminar paciente"
          aria-label={`Eliminar a ${paciente.nombre}`}
          className="flex items-center justify-center rounded-xl border border-red-500/20 px-3 py-2 text-red-400 transition-colors hover:bg-red-500/10"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </article>
  );
}
