import { api } from "../lib/axios";

interface RespuestaLista {
  total?: number;
  data?: unknown[];
}

function obtenerTotal(respuesta: { data: unknown[] | RespuestaLista }): number {
  const datos = respuesta.data;

  if (Array.isArray(datos)) {
    return datos.length;
  }

  return datos.total ?? datos.data?.length ?? 0;
}

export async function obtenerMetricas() {
  const [doctores, programadas, completadas] = await Promise.all([
    api.get("/doctores"),
    api.get("/citas?estado=Programada"),
    api.get("/citas?estado=Completada"),
  ]);

  return {
    totalMedicos: obtenerTotal(doctores),
    citasProgramadas: obtenerTotal(programadas),
    completadasHoy: obtenerTotal(completadas),
  };
}
