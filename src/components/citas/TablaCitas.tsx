import type { Cita } from "../../types/citas.ts";

interface TablaCitasProps {
  citas: Cita[];
  onVerCita?: (cita: Cita) => void;
}

function formatearFecha(fecha: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(fecha));
}

function obtenerEstilosEstado(estado: Cita["estado"]): string {
  const estilos: Record<Cita["estado"], string> = {
    PROGRAMADA: "bg-blue-100 text-blue-700",
    COMPLETADA: "bg-green-100 text-green-700",
    CANCELADA: "bg-red-100 text-red-700",
  };

  return estilos[estado];
}

function formatearEstado(estado: Cita["estado"]): string {
  const etiquetas: Record<Cita["estado"], string> = {
    PROGRAMADA: "Programada",
    COMPLETADA: "Completada",
    CANCELADA: "Cancelada",
  };

  return etiquetas[estado];
}

export default function TablaCitas({ citas, onVerCita }: TablaCitasProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[750px] text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Fecha y hora</th>
              <th className="px-6 py-4 font-semibold">Paciente</th>
              <th className="px-6 py-4 font-semibold">Doctor</th>
              <th className="px-6 py-4 font-semibold">Estado</th>
              <th className="px-6 py-4 text-right font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {citas.map((cita) => (
              <tr key={cita.id_cita} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <p className="font-medium text-slate-800">
                    {formatearFecha(cita.fecha)}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">
                    {cita.paciente.nombre} {cita.paciente.apellido}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="font-medium text-slate-800">
                    Dr. {cita.doctor.nombre} {cita.doctor.apellido}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${obtenerEstilosEstado(cita.estado)}`}
                  >
                    {formatearEstado(cita.estado)}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onVerCita?.(cita)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}

            {citas.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  No hay citas para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
