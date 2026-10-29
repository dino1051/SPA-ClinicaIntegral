import { NavLink } from "react-router-dom";
import { Users, CalendarPlus, CalendarDays } from "lucide-react";

const enlaces = [
  {
    nombre: "Pacientes",
    ruta: "/pacientes",
    icono: Users,
    exacto: true,
  },
  {
    nombre: "Citas",
    ruta: "/citas",
    icono: CalendarDays,
    exacto: true,
  },
  {
    nombre: "Agendar cita",
    ruta: "/citas/nueva",
    icono: CalendarPlus,
    exacto: true,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-slate-200 bg-white p-4 md:block">
      <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Menú principal
      </p>

      <nav className="space-y-1">
        {enlaces.map(({ nombre, ruta, icono: Icono, exacto }) => (
          <NavLink
            key={ruta}
            to={ruta}
            end={exacto}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <Icono size={20} />
            <span>{nombre}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
