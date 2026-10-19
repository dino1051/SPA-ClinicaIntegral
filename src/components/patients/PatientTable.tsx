import type { Paciente } from "../../types/pacientes";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

interface PatientTableProps {
  pacientes: Paciente[];
  onVerPaciente: (paciente: Paciente) => void;
  onEditarPaciente: (paciente: Paciente) => void;
  onEliminarPaciente: (paciente: Paciente) => void;
  onRestablecerFiltros?: () => void;
}

function getInitials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();
}

function StatusBadge({ estado }: Pick<Paciente, "estado">) {
  const estilos = {
    activo: {
      texto: "Activo",
      contenedor: "bg-secondary-fixed/40 text-secondary",
      punto: "bg-secondary",
    },
    inactivo: {
      texto: "Inactivo",
      contenedor: "bg-surface-container text-outline",
      punto: "bg-outline",
    },
    en_espera: {
      texto: "En espera",
      contenedor: "bg-surface-container-highest text-primary",
      punto: "bg-primary-container",
    },
  };

  const estilo = estilos[estado];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-label-sm font-bold ${estilo.contenedor}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${estilo.punto}`} />
      {estilo.texto}
    </span>
  );
}

function SpecialtyBadge({ especialidad }: { especialidad: string }) {
  return (
    <span className="inline-block rounded-lg bg-surface-container-high px-2.5 py-0.5 text-label-sm font-semibold text-primary">
      {especialidad}
    </span>
  );
}

function PatientActions({
  paciente,
  onVerPaciente,
  onEditarPaciente,
  onEliminarPaciente,
  mobile = false,
}: {
  paciente: Paciente;
  onVerPaciente: (paciente: Paciente) => void;
  onEditarPaciente: (paciente: Paciente) => void;
  onEliminarPaciente: (paciente: Paciente) => void;
  mobile?: boolean;
}) {
  const estiloBoton = mobile
    ? "bg-surface-container text-on-surface hover:text-primary"
    : "text-on-surface-variant hover:bg-surface-container hover:text-primary";

  return (
    <div className="inline-flex items-center justify-end gap-1">
      <Link
        to={`/pacientes/${paciente.id}`}
        className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-blue-600 hover:bg-blue-50"
      >
        <Eye size={18} />
        Ver detalles
      </Link>

      <button
        type="button"
        onClick={() => onEditarPaciente(paciente)}
        title="Editar paciente"
        aria-label={`Editar a ${paciente.nombre} ${paciente.apellido}`}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${estiloBoton}`}
      >
        <span className="material-symbols-outlined text-[18px]">edit</span>
      </button>

      <button
        type="button"
        onClick={() => onEliminarPaciente(paciente)}
        title="Eliminar paciente"
        aria-label={`Eliminar a ${paciente.nombre} ${paciente.apellido}`}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          mobile
            ? "bg-error-container/40 text-error hover:bg-error-container"
            : "text-on-surface-variant hover:bg-error-container/30 hover:text-error"
        }`}
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>
    </div>
  );
}

export function PatientTable({
  pacientes,
  onVerPaciente,
  onEditarPaciente,
  onEliminarPaciente,
  onRestablecerFiltros,
}: PatientTableProps) {
  return (
    <section className="px-margin py-space-xs pb-space-lg">
      <div className="overflow-hidden rounded-xl bg-surface-container-lowest shadow-sm">
        {/* Encabezado del listado */}
        <div className="flex items-center justify-between bg-surface-container-low px-space-md py-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[18px] text-primary">
              badge
            </span>

            <h3 className="text-title-sm font-bold text-on-surface">
              Listado Clínico
            </h3>
          </div>

          <span className="rounded-full bg-surface-container px-2 py-0.5 text-label-sm text-on-surface-variant">
            {pacientes.length}{" "}
            {pacientes.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        {/* Estado vacío */}
        {pacientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-space-xl text-center">
            <div className="mb-space-sm flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-primary">
              <span className="material-symbols-outlined text-[36px]">
                person_search
              </span>
            </div>

            <h4 className="text-title-md font-bold text-on-surface">
              No se encontraron pacientes
            </h4>

            <p className="mt-1 max-w-xs text-body-sm text-on-surface-variant">
              Ningún expediente clínico coincide con los criterios de búsqueda o
              filtros seleccionados.
            </p>

            {onRestablecerFiltros && (
              <button
                type="button"
                onClick={onRestablecerFiltros}
                className="mt-space-md inline-flex items-center gap-space-xs rounded-lg bg-surface-container px-space-md py-space-xs text-title-sm text-primary transition-all hover:bg-surface-container-high"
              >
                <span className="material-symbols-outlined text-[18px]">
                  refresh
                </span>
                Restablecer filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="hidden w-full overflow-x-auto md:block">
              <table className="w-full text-left text-body-sm text-on-surface">
                <thead className="bg-surface-container-low/60 text-label-sm uppercase text-on-surface-variant">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Paciente
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Contacto
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Especialidad
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Última cita
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Estado
                    </th>
                    <th scope="col" className="px-4 py-3 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y-0">
                  {pacientes.map((paciente) => (
                    <tr
                      key={paciente.id}
                      className="transition-colors hover:bg-surface-container-low/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container text-title-sm font-bold text-primary">
                            {getInitials(paciente.nombre, paciente.apellido)}
                          </div>

                          <div className="min-w-0">
                            <span className="block truncate text-title-sm font-bold text-on-surface">
                              {paciente.nombre} {paciente.apellido}
                            </span>

                            <span className="text-label-sm uppercase text-outline">
                              {paciente.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex min-w-0 flex-col">
                          <span className="truncate text-on-surface">
                            {paciente.email}
                          </span>
                          <span className="text-body-sm text-on-surface-variant">
                            {paciente.telefono}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <SpecialtyBadge
                          especialidad={paciente.especialidadAsignada}
                        />
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-label-sm text-on-surface-variant">
                        {paciente.ultimaCita || "Sin cita"}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge estado={paciente.estado} />
                      </td>

                      <td className="px-4 py-3 text-right">
                        <PatientActions
                          paciente={paciente}
                          onVerPaciente={onVerPaciente}
                          onEditarPaciente={onEditarPaciente}
                          onEliminarPaciente={onEliminarPaciente}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tarjetas para móvil */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {pacientes.map((paciente) => (
                <article
                  key={paciente.id}
                  className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low/50 p-space-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-space-xs">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container text-title-sm font-bold text-primary">
                        {getInitials(paciente.nombre, paciente.apellido)}
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-title-sm font-bold text-on-surface">
                          {paciente.nombre} {paciente.apellido}
                        </h4>
                        <span className="text-label-sm text-outline">
                          {paciente.id}
                        </span>
                      </div>
                    </div>

                    <StatusBadge estado={paciente.estado} />
                  </div>

                  <div className="grid grid-cols-2 gap-space-xs pt-1 text-body-sm">
                    <div className="min-w-0">
                      <span className="block text-label-sm text-outline">
                        Especialidad
                      </span>
                      <SpecialtyBadge
                        especialidad={paciente.especialidadAsignada}
                      />
                    </div>

                    <div>
                      <span className="block text-label-sm text-outline">
                        Última cita
                      </span>
                      <span className="font-semibold text-on-surface">
                        {paciente.ultimaCita || "Sin cita"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="max-w-[180px] truncate text-body-sm text-on-surface-variant">
                      {paciente.telefono}
                    </span>

                    <PatientActions
                      paciente={paciente}
                      onVerPaciente={onVerPaciente}
                      onEditarPaciente={onEditarPaciente}
                      onEliminarPaciente={onEliminarPaciente}
                      mobile
                    />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
