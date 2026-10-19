import { Link } from "react-router-dom";
import { ArrowLeft, SearchX } from "lucide-react";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-3xl bg-blue-100 text-blue-700">
          <SearchX size={38} />
        </div>

        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
          Error 404
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Página no encontrada
        </h1>

        <p className="mt-3 text-slate-500">
          Parece que esta dirección no existe o que la página fue movida.
        </p>

        <Link
          to="/pacientes"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
