import { z } from "zod";

export const citaSchema = z.object({
  id_paciente: z.coerce.number().int().positive("Selecciona un paciente"),

  id_doctor: z.coerce.number().int().positive("Selecciona un médico"),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa una fecha válida"),
  hora: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ingresa una hora válida"),
  motivo: z
    .string()
    .trim()
    .min(10, "El motivo debe tener al menos 10 caracteres")
    .max(500, "El motivo no puede superar los 500 caracteres"),
  urgencia: z.enum(["baja", "media", "alta", "critica"]),
});

export type CitaFormData = z.infer<typeof citaSchema>;
