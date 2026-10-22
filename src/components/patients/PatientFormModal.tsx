import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import type { Paciente } from "../../types/pacientes";
import {
  pacienteSchema,
  type PacienteFormulario,
} from "../../schemas/paciente.schema";

interface PatientFormModalProps {
  paciente: Paciente | null;
  onCerrar: () => void;
  onGuardar: (datos: PacienteFormulario) => void | Promise<void>;
}

export function PatientFormModal({
  paciente,
  onCerrar,
  onGuardar,
}: PatientFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormulario>({
    resolver: zodResolver(pacienteSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      fechaNacimiento: "",
    },
  });

  // Carga los datos al editar o limpia el formulario al crear.
  useEffect(() => {
    reset({
      nombre: paciente?.nombre ?? "",
      apellido: paciente?.apellido ?? "",
      email: paciente?.email ?? "",
      telefono: paciente?.telefono ?? "",
      fechaNacimiento: paciente?.fechaNacimiento ?? "",
    });
  }, [paciente, reset]);

  // Esta función solo recibe datos que pasaron la validación.
  const manejarEnvio = async (datosFormulario: PacienteFormulario) => {
    await onGuardar(datosFormulario);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
      onClick={onCerrar}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-form-title"
        className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-surface p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2
              id="patient-form-title"
              className="text-xl font-bold text-primary"
            >
              {paciente ? "Editar paciente" : "Nuevo paciente"}
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Completa la información del paciente.
            </p>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar formulario"
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(manejarEnvio)} noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Nombre */}
            <label className="space-y-1 text-sm text-gray-300">
              <span className="block">Nombre</span>
              <input
                {...register("nombre")}
                placeholder="Nombre del paciente"
                aria-invalid={!!errors.nombre}
                className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-white"
              />
              {errors.nombre && (
                <p role="alert" className="text-sm text-red-400">
                  {errors.nombre.message}
                </p>
              )}
            </label>

            {/* Apellido */}
            <label className="space-y-1 text-sm text-gray-300">
              <span className="block">Apellido</span>
              <input
                {...register("apellido")}
                placeholder="Apellido del paciente"
                aria-invalid={!!errors.apellido}
                className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-white"
              />
              {errors.apellido && (
                <p role="alert" className="text-sm text-red-400">
                  {errors.apellido.message}
                </p>
              )}
            </label>

            {/* Correo */}
            <label className="space-y-1 text-sm text-gray-300 sm:col-span-2">
              <span className="block">Correo electrónico</span>
              <input
                type="email"
                {...register("email")}
                placeholder="correo@ejemplo.com"
                aria-invalid={!!errors.email}
                className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-white"
              />
              {errors.email && (
                <p role="alert" className="text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </label>

            {/* Teléfono */}
            <label className="space-y-1 text-sm text-gray-300">
              <span className="block">Teléfono</span>
              <input
                type="tel"
                {...register("telefono")}
                placeholder="Teléfono del paciente"
                aria-invalid={!!errors.telefono}
                className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-white"
              />
              {errors.telefono && (
                <p role="alert" className="text-sm text-red-400">
                  {errors.telefono.message}
                </p>
              )}
            </label>

            {/* Fecha nacimiento */}
            <label className="space-y-1 text-sm text-gray-300">
              <span className="block">Fecha de nacimiento</span>
              <input
                {...register("fechaNacimiento")}
                placeholder="1980-06-10T00:00:00.000Z"
                aria-invalid={!!errors.fechaNacimiento}
                className="w-full rounded-xl border border-white/10 bg-surface-2 px-3 py-2 text-white"
              />
            </label>
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCerrar}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-200 hover:bg-white/5"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting
                ? "Guardando..."
                : paciente
                  ? "Guardar cambios"
                  : "Crear paciente"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
