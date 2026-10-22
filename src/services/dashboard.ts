import { api } from "../lib/axios";

function obtenerTotal(datos: unknown): number {
  if (Array.isArray(datos)) {
    return datos.length;
  }

  if (typeof datos === "object" && datos !== null) {
    const respuesta = datos as {
      total?: number;
      data?: unknown[];
    };

    return respuesta.total ?? respuesta.data?.length ?? 0;
  }

  return 0;
}

export interface MetricasDashboard {
  totalMedicos: number;
  citasProgramadas: number;
  completadasHoy: number;
}

export async function obtenerMetricas(): Promise<MetricasDashboard> {
  const [respuestaDoctores, respuestaProgramadas, respuestaCompletadas] =
    await Promise.all([
      api.get("/doctores"),
      api.get("/citas", {
        params: { estado: "PROGRAMADA" },
      }),
      api.get("/citas", {
        params: { estado: "COMPLETADA" },
      }),
    ]);

  return {
    totalMedicos: obtenerTotal(respuestaDoctores.data),
    citasProgramadas: obtenerTotal(respuestaProgramadas.data),
    completadasHoy: obtenerTotal(respuestaCompletadas.data),
  };
}
