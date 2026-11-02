import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

export type TipoAlerta = "info" | "exito" | "advertencia" | "error";

interface AlertaBannerProps {
  tipo: TipoAlerta;
  mensaje: string;
  titulo?: string;
  onCerrar?: () => void;
}

const estilos = {
  info: {
    contenedor: "border-blue-200 bg-blue-50 text-blue-800",
    icono: Info,
  },
  exito: {
    contenedor: "border-green-200 bg-green-50 text-green-800",
    icono: CheckCircle2,
  },
  advertencia: {
    contenedor: "border-amber-200 bg-amber-50 text-amber-800",
    icono: AlertTriangle,
  },
  error: {
    contenedor: "border-red-200 bg-red-50 text-red-800",
    icono: AlertCircle,
  },
};

export default function AlertaBanner({
  tipo,
  mensaje,
  titulo,
  onCerrar,
}: AlertaBannerProps) {
  const configuracion = estilos[tipo];
  const Icono = configuracion.icono;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border p-4 ${configuracion.contenedor}`}
    >
      <Icono size={21} className="mt-0.5 shrink-0" />

      <div className="min-w-0 flex-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        <p className="text-sm">{mensaje}</p>
      </div>

      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar alerta"
          className="shrink-0 rounded-md p-1 transition hover:bg-black/5"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
