import { Inbox } from "lucide-react";

interface EstadoVacioProps {
  titulo: string;
  descripcion?: string;
  accion?: {
    label: string;
    onClick: () => void;
  };
}

export default function EstadoVacio({
  titulo,
  descripcion = "No hay información para mostrar.",
  accion,
}: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <Inbox size={30} className="text-slate-400" />
      </div>

      <h3 className="font-semibold text-slate-800">{titulo}</h3>

      <p className="mt-2 max-w-sm text-sm text-slate-500">{descripcion}</p>

      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          {accion.label}
        </button>
      )}
    </div>
  );
}
