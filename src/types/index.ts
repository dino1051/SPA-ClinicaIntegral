export type Tendencia = "positiva" | "negativa" | "neutra";

export interface Metrica {
  id: string;
  titulo: string;
  valor: number | string;
  descripcion: string;
  tendencia: Tendencia;
  icono: string;
}

export const colorPorTendencia: Record<Tendencia, string> = {
  positiva: "text-emerald-600",
  negativa: "text-rose-600",
  neutra: "text-slate-600",
};

interface StatusBadgeProps {
  activo: boolean;
}
