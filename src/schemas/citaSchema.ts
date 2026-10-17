import { z } from "zod";

function esFechaReal(fecha: string): boolean {
  const partes = fecha.split("-");

  if (partes.length !== 3) return false;

  const [anio, mes, dia] = partes.map(Number);
  const fechaUTC = new Date(Date.UTC(anio, mes - 1, dia));

  return (
    fechaUTC.getUTCFullYear() === anio &&
    fechaUTC.getUTCMonth() === mes - 1 &&
    fechaUTC.getUTCDate() === dia
  );
}

function obtenerFechaLocal(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

export const citaSchema = z.object({
  pacienteNombre: z
    .string()
    .trim()
    .min(3, "El nombre del paciente debe tener al menos 3 caracteres"),

  medicoId: z.string().min(1, "Selecciona un médico"),

  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD")
    .refine(esFechaReal, "Ingresa una fecha válida")
    .refine(
      (fecha) => fecha >= obtenerFechaLocal(),
      "La fecha no puede ser anterior a hoy",
    ),

  hora: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):[0-5]\d$/,
      "Ingresa una hora válida entre 00:00 y 23:59",
    ),

  motivo: z
    .string()
    .trim()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede superar los 500 caracteres"),

  urgencia: z.enum(["baja", "media", "alta", "critica"]),
});

export type CitaFormData = z.infer<typeof citaSchema>;
