import { Link } from "react-router-dom";
import { Stethoscope } from "lucide-react";

export function Header() {
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
        </Link>
      </div>
    </header>
  );
}
