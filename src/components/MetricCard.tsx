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
    <div className="p-4 border rounded-lg bg-amber-100">
      <h3 className="font-bold">
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
