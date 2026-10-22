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

  fechaNacimiento: z.string().min(1, "La fecha de nacimiento es obligatoria"),
});

export type PacienteFormulario = z.infer<typeof pacienteSchema>;
