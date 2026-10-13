import type { Paciente } from "../../types/pacientes";

interface PatientDetailsModalProps {
  paciente: Paciente | null;
  onCerrar: () => void;
  onEditar: (paciente: Paciente) => void;
}

export function PatientDetailsModal({
  paciente,
  onCerrar,
  onEditar,
}: PatientDetailsModalProps) {
  if (!paciente) return null;

  const iniciales =
    `${paciente.nombre.charAt(0)}${paciente.apellido.charAt(0)}`.toUpperCase();

  const estadoTexto: Record<string, string> = {
    activo: "Activo",
    inactivo: "Inactivo",
    en_espera: "En espera",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCerrar}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-details-title"
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2
              id="patient-details-title"
              className="text-xl font-bold text-primary"
            >
              Detalles del paciente
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Información general y de contacto
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar detalles"
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
            {iniciales}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              {paciente.nombre} {paciente.apellido}
            </h3>
            <p className="text-sm text-gray-400">ID: {paciente.id}</p>
            <span className="mt-2 inline-block rounded-full bg-white/10 px-3 py-1 text-xs text-gray-200">
              {estadoTexto[paciente.estado] ?? paciente.estado}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <DetailRow
            icon="mail"
            label="Correo electrónico"
            value={paciente.email}
          />
          <DetailRow icon="call" label="Teléfono" value={paciente.telefono} />
          <DetailRow
            icon="medical_services"
            label="Especialidad asignada"
            value={paciente.especialidadAsignada || "Sin asignar"}
          />
          <DetailRow
            icon="calendar_month"
            label="Última cita"
            value={paciente.ultimaCita || "Sin citas registradas"}
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => onEditar(paciente)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Editar paciente
          </button>
        </div>
      </section>
    </div>
  );
}

interface DetailRowProps {
  icon: string;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <span className="material-symbols-outlined mt-0.5 text-primary">
        {icon}
      </span>

      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="break-words text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}
