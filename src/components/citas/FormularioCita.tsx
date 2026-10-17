import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { citaSchema, type CitaFormData } from "../../schemas/citaSchema";
import { useMedicos } from "../../hooks/useMedicos";
import type { Medico } from "../../hooks/useMedicos";

interface CitaConfirmada extends CitaFormData {
  medicoNombre: string;
  especialidad: string;
}

function obtenerFechaLocal(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

const valoresIniciales: CitaFormData = {
  pacienteNombre: "",
  medicoId: "",
  fecha: "",
  hora: "",
  motivo: "",
  urgencia: "media",
};

export function FormularioCita() {
  const { medicos, cargando } = useMedicos();
  const [confirmacion, setConfirmacion] = useState<CitaConfirmada | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: valoresIniciales,
  });

  const clasesCampo = (tieneError: boolean) =>
    `w-full rounded-xl border bg-surface-2 px-3 py-2.5 text-white outline-none transition-colors focus:border-primary ${
      tieneError ? "border-red-500" : "border-white/10"
    }`;

  async function manejarEnvio(datos: CitaFormData) {
    // Simula el tiempo de respuesta de un servidor.
    await new Promise<void>((resolve) => setTimeout(resolve, 1500));

    const medicoSeleccionado = medicos.find(
      (medico) => medico.id === datos.medicoId,
    );

    if (!medicoSeleccionado) return;

    setConfirmacion({
      ...datos,
      medicoNombre: medicoSeleccionado.nombre,
      especialidad: medicoSeleccionado.especialidad,
    });
  }

  function agendarOtraCita() {
    setConfirmacion(null);
    reset(valoresIniciales);
  }

  if (confirmacion) {
    return (
      <section className="mx-auto w-full max-w-2xl rounded-2xl border border-emerald-500/20 bg-surface p-6 text-white shadow-xl sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <span className="material-symbols-outlined text-4xl">
              check_circle
            </span>
          </div>

          <h2 className="text-2xl font-bold">¡Cita agendada correctamente!</h2>

          <p className="mt-2 text-sm text-gray-400">
            Esta es la confirmación de tu cita simulada.
          </p>
        </div>

        <div className="space-y-4 rounded-xl bg-surface-2 p-4 sm:p-6">
          <div>
            <p className="text-sm text-gray-400">Paciente</p>
            <p className="font-semibold">{confirmacion.pacienteNombre}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Médico</p>
            <p className="font-semibold">{confirmacion.medicoNombre}</p>
            <p className="text-sm text-gray-400">{confirmacion.especialidad}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Fecha</p>
              <p className="font-semibold">{confirmacion.fecha}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Hora</p>
              <p className="font-semibold">{confirmacion.hora}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400">Motivo</p>
            <p className="break-words">{confirmacion.motivo}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Urgencia</p>
            <p className="font-semibold capitalize">{confirmacion.urgencia}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={agendarOtraCita}
          className="mt-6 w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Agendar otra cita
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-surface p-6 text-white shadow-xl sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Agendar cita médica</h1>
        <p className="mt-2 text-sm text-gray-400">
          Completa los datos para programar una nueva cita.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(manejarEnvio)}
        noValidate
        className="space-y-5"
      >
        {/* Nombre del paciente */}
        <div>
          <label
            htmlFor="pacienteNombre"
            className="mb-1.5 block text-sm font-medium text-gray-200"
          >
            Nombre del paciente
          </label>
          <input
            id="pacienteNombre"
            {...register("pacienteNombre")}
            placeholder="Ej. Daniel López"
            aria-invalid={!!errors.pacienteNombre}
            className={clasesCampo(!!errors.pacienteNombre)}
          />
          {errors.pacienteNombre && (
            <p role="alert" className="mt-1 text-sm text-red-400">
              {errors.pacienteNombre.message}
            </p>
          )}
        </div>

        {/* Médico */}
        <div>
          <label
            htmlFor="medicoId"
            className="mb-1.5 block text-sm font-medium text-gray-200"
          >
            Médico
          </label>
          <select
            id="medicoId"
            {...register("medicoId")}
            disabled={cargando}
            aria-invalid={!!errors.medicoId}
            className={clasesCampo(!!errors.medicoId)}
          >
            {cargando ? (
              <option value="" disabled>
                Cargando médicos...
              </option>
            ) : (
              <option value="">Selecciona un médico</option>
            )}

            {medicos.map((medico) => (
              <option key={medico.id} value={medico.id}>
                {medico.nombre} · {medico.especialidad}
              </option>
            ))}
          </select>
          {errors.medicoId && (
            <p role="alert" className="mt-1 text-sm text-red-400">
              {errors.medicoId.message}
            </p>
          )}
        </div>

        {/* Fecha y hora */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="fecha"
              className="mb-1.5 block text-sm font-medium text-gray-200"
            >
              Fecha
            </label>
            <input
              id="fecha"
              type="date"
              min={obtenerFechaLocal()}
              {...register("fecha")}
              aria-invalid={!!errors.fecha}
              className={clasesCampo(!!errors.fecha)}
            />
            {errors.fecha && (
              <p role="alert" className="mt-1 text-sm text-red-400">
                {errors.fecha.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="hora"
              className="mb-1.5 block text-sm font-medium text-gray-200"
            >
              Hora
            </label>
            <input
              id="hora"
              type="time"
              {...register("hora")}
              aria-invalid={!!errors.hora}
              className={clasesCampo(!!errors.hora)}
            />
            {errors.hora && (
              <p role="alert" className="mt-1 text-sm text-red-400">
                {errors.hora.message}
              </p>
            )}
          </div>
        </div>

        {/* Motivo */}
        <div>
          <label
            htmlFor="motivo"
            className="mb-1.5 block text-sm font-medium text-gray-200"
          >
            Motivo de la consulta
          </label>
          <textarea
            id="motivo"
            rows={4}
            {...register("motivo")}
            placeholder="Describe el motivo de la cita (10 a 500 caracteres)"
            aria-invalid={!!errors.motivo}
            className={clasesCampo(!!errors.motivo)}
          />
          {errors.motivo && (
            <p role="alert" className="mt-1 text-sm text-red-400">
              {errors.motivo.message}
            </p>
          )}
        </div>

        {/* Urgencia */}
        <div>
          <label
            htmlFor="urgencia"
            className="mb-1.5 block text-sm font-medium text-gray-200"
          >
            Nivel de urgencia
          </label>
          <select
            id="urgencia"
            {...register("urgencia")}
            aria-invalid={!!errors.urgencia}
            className={clasesCampo(!!errors.urgencia)}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
          {errors.urgencia && (
            <p role="alert" className="mt-1 text-sm text-red-400">
              {errors.urgencia.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || cargando}
          className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Agendando..." : "Agendar cita"}
        </button>
      </form>
    </section>
  );
}
