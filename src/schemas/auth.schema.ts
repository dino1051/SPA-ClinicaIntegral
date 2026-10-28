import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Introduce un email válido"),

  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .email("Introduce un email válido"),

  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/\S/, "La contraseña no puede contener solo espacios"),

  role: z.enum(["RECEPCIONISTA", "DOCTOR"]).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
