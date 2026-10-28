import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

export function Header() {
  const usuario = useAuthStore((state) => state.usuario);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center px-4 md:px-8">
        <Link
          to="/pacientes"
          className="flex items-center gap-3"
          aria-label="Ir al inicio"
        >
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <Stethoscope size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold tracking-tight">MediCare</h1>
            <p className="hidden text-xs text-slate-500 sm:block">
              Gestión de pacientes
            </p>
          </div>
          <Link
            to="/perfil"
            className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-slate-100"
          >
            {usuario.foto ? (
              <img
                src={usuario.foto}
                alt="Foto de perfil"
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {usuario.nombre}
              </p>

              <p className="text-xs text-slate-500">Mi perfil</p>
            </div>
          </Link>
        </Link>
      </div>
    </header>
  );
}
