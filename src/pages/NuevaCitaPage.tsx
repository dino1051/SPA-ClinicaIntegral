import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { FormularioCita } from "../components/citas/FormularioCita";

export function NuevaCitaPage() {
  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/pacientes"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={18} />
        Volver a pacientes
      </Link>

      <div>
        <h2 className="text-2xl font-bold">Agendar nueva cita</h2>
        <p className="mt-1 text-slate-500">
          Completa la información para programar una cita médica.
        </p>
      </div>

      <FormularioCita />
    </section>
  );
}
