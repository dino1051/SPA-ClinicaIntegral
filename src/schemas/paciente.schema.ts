import { z } from "zod";

export const pacienteSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(50, "El nombre no puede superar 50 caracteres"),

  apellido: z
    .string()
    .trim()
    .min(1, "El apellido es obligatorio")
    .max(50, "El apellido no puede superar 50 caracteres"),

  email: z
    .string()
    .trim()
    .min(1, "El correo es obligatorio")
    .email("Ingresa un correo válido"),

  telefono: z
    .string()
    .trim()
    .min(1, "El teléfono es obligatorio")
    .regex(/^[0-9+()\s-]{10,20}$/, "Ingresa un teléfono válido"),

  especialidadAsignada: z.string().min(1, "Selecciona una especialidad"),

  ultimaCita: z.string().min(1, "La fecha de la última cita es obligatoria"),

  estado: z.enum(["activo", "inactivo", "en_espera"]),
});

export type PacienteFormulario = z.infer<typeof pacienteSchema>;
