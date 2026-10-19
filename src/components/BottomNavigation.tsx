import { NavLink } from "react-router-dom";
import { Users, CalendarPlus } from "lucide-react";

const enlaces = [
  {
    nombre: "Pacientes",
    ruta: "/pacientes",
    icono: Users,
    exacto: true,
  },
  {
    nombre: "Nueva cita",
    ruta: "/citas/nueva",
    icono: CalendarPlus,
    exacto: false,
  },
];

export function BottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-2">
        {enlaces.map(({ nombre, ruta, icono: Icono, exacto }) => (
          <NavLink
            key={ruta}
            to={ruta}
            end={exacto}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-3 text-xs font-medium ${
                isActive ? "text-blue-700" : "text-slate-500"
              }`
            }
          >
            <Icono size={22} />
            <span>{nombre}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
