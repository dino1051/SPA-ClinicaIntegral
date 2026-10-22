interface PatientFiltersProps {
  busqueda: string;
  estado: string;
  onBusquedaChange: (valor: string) => void;
  onEstadoChange: (valor: string) => void;
  onLimpiar: () => void;
}

export function PatientFilters({
  busqueda,
  estado,
  onBusquedaChange,
  onEstadoChange,
  onLimpiar,
}: PatientFiltersProps) {
  return (
    <section className="px-margin py-space-xs">
      <div className="flex flex-col items-stretch gap-space-sm rounded-xl bg-surface-container-lowest p-space-sm shadow-sm md:flex-row md:items-center">
        {/* Buscador */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-outline-variant">
            search
          </span>

          <input
            type="search"
            value={busqueda}
            onChange={(event) => onBusquedaChange(event.target.value)}
            placeholder="Buscar por nombre, email o teléfono..."
            aria-label="Buscar pacientes"
            className="w-full rounded-lg bg-surface-container-low py-2 pl-10 pr-4 text-body-sm text-on-surface placeholder:text-outline-variant transition-all focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-space-xs">
          <select
            value={estado}
            onChange={(e) => onEstadoChange(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>

          <button
            type="button"
            onClick={onLimpiar}
            title="Restablecer filtros"
            aria-label="Restablecer filtros"
            className="flex h-9 items-center justify-center rounded-lg bg-surface-container px-space-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">
              filter_alt_off
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
