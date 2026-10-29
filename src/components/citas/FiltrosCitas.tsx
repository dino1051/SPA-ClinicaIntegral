import { Search, FilterX } from "lucide-react";
import type { EstadoCita, DoctorCita } from "../../types/citas";

interface FiltrosCitasProps {
  busqueda: string;
  estado: EstadoCita | "TODAS";
  doctorId: string;
  fecha: string;
  doctores: DoctorCita[];

  onBusquedaChange: (valor: string) => void;
  onEstadoChange: (valor: EstadoCita | "TODAS") => void;
  onDoctorChange: (valor: string) => void;
  onFechaChange: (valor: string) => void;
  onLimpiar: () => void;
}

export default function FiltrosCitas({
  busqueda,
  estado,
  doctorId,
  fecha,
  doctores,
  onBusquedaChange,
  onEstadoChange,
  onDoctorChange,
  onFechaChange,
  onLimpiar,
}: FiltrosCitasProps) {
  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">Filtrar citas</h3>
          <p className="mt-1 text-sm text-slate-500">
            Encuentra citas utilizando los siguientes filtros.
          </p>
        </div>

        <button
          type="button"
          onClick={onLimpiar}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
        >
          <FilterX size={17} />
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Búsqueda */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Buscar paciente
          </label>

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={busqueda}
              onChange={(e) => onBusquedaChange(e.target.value)}
              placeholder="Nombre o apellido..."
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Estado */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Estado
          </label>

          <select
            value={estado}
            onChange={(e) =>
              onEstadoChange(e.target.value as EstadoCita | "TODAS")
            }
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="TODAS">Todos los estados</option>
            <option value="PROGRAMADA">Programadas</option>
            <option value="COMPLETADA">Completadas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>
        </div>

        {/* Doctor */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Doctor
          </label>

          <select
            value={doctorId}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="TODOS">Todos los doctores</option>

            {doctores.map((doctor) => (
              <option key={doctor.id_doctor} value={doctor.id_doctor}>
                {doctor.nombre} {doctor.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Fecha
          </label>

          <input
            type="date"
            value={fecha}
            onChange={(e) => onFechaChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
    </section>
  );
}
