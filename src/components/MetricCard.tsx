import type { Metrica } from "../types";
import { colorPorTendencia } from "../types/index";

interface MetricCardProps {
  metrica: Metrica;
}

export function CardMetrica({
  id,
  titulo,
  valor,
  descripcion,
  tendencia,
  icono,
}: Metrica) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#202331] p-5 shadow-lg">
      <h3 className="text-sm font-medium text-gray-300">
        {id} : {titulo}{" "}
      </h3>
      <p>{valor} </p>
      <p
        className={
          tendencia === "positiva"
            ? `${colorPorTendencia.positiva}`
            : tendencia === "negativa"
              ? `${colorPorTendencia.negativa}`
              : `${colorPorTendencia.neutra}`
        }
      >
        {descripcion}
      </p>
      <p>{tendencia} </p>
      <p>{icono} </p>
    </div>
  );
}
