import { useState, useOptimistic, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCitasStore } from "../../stores/useCitasStore";
import { citaSchema, type CitaFormData } from "../../schemas/citaSchema";
import { useMedicos } from "../../hooks/useMedicos";
import type { CrearCitaPayload } from "../../types/citas";
import { usePacientesStore } from "../../stores/usePacientesStore";

interface CitaConfirmada extends CitaFormData {
  id_cita: number;
  pacienteNombre: string;
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

const valoresIniciales: Partial<CitaFormData> = {
  id_paciente: undefined,
  id_doctor: undefined,
  fecha: "",
  hora: "",
  motivo: "",
  urgencia: "media",
};

export function FormularioCita() {
  const agregarCita = useCitasStore((state) => state.agregarCita);
  const {
    medicos,
    cargando: cargandoMedicos,
    error: errorMedicos,
  } = useMedicos();

  const {
    pacientes,
    cargando: cargandoPacientes,
    error: errorPacientes,
    cargarPacientes,
  } = usePacientesStore();

  useEffect(() => {
    void cargarPacientes();
  }, [cargarPacientes]);

  const [confirmacion, setConfirmacion] = useState<CitaConfirmada | null>(null);

  const [isPending, startTransition] = useTransition();

  const [procesandoOptimista, establecerProcesandoOptimista] = useOptimistic(
    false,
    (_estadoActual: boolean, nuevoEstado: boolean) => nuevoEstado,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: valoresIniciales,
  });

  const clasesCampo = (tieneError: boolean) =>
    `w-full rounded-xl border bg-surface-2 px-3 py-2.5 text-white outline-none transition-colors focus:border-primary ${
      tieneError ? "border-red-500" : "border-white/10"
    }`;

  function manejarEnvio(datos: CitaFormData) {
    startTransition(async () => {
      establecerProcesandoOptimista(true);

      try {
        const pacienteSeleccionado = pacientes.find(
          (paciente) => paciente.id_paciente === datos.id_paciente,
        );

        const medicoSeleccionado = medicos.find(
          (medico) => medico.id_doctor === datos.id_doctor,
        );

        if (!pacienteSeleccionado || !medicoSeleccionado) {
          toast.error("Selecciona un paciente y un médico válidos.");
          return;
        }

        const fechaLocal = new Date(`${datos.fecha}T${datos.hora}:00`);

        if (Number.isNaN(fechaLocal.getTime())) {
          toast.error("La fecha y hora no son válidas.");
          return;
        }

        const payload: CrearCitaPayload = {
          fecha: fechaLocal.toISOString(),
          id_paciente: datos.id_paciente,
          id_doctor: datos.id_doctor,
        };

        const respuesta = await agregarCita(payload);

        setConfirmacion({
          ...datos,
          id_cita: respuesta.id_cita,
          pacienteNombre: `${pacienteSeleccionado.nombre} ${pacienteSeleccionado.apellido}`,
          medicoNombre: `${medicoSeleccionado.nombre} ${medicoSeleccionado.apellido}`,
          especialidad: medicoSeleccionado.especialidad,
        });

        toast.success("¡La cita se ha agendado correctamente!");
      } catch (error) {
        console.error("Error al crear la cita:", error);

        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const errorApi = error as {
            response?: {
              data?: { message?: string | string[] };
            };
          };

          const mensaje = errorApi.response?.data?.message;

          if (Array.isArray(mensaje)) {
            toast.error(mensaje.join(", "));
            return;
          }

          if (mensaje) {
            toast.error(mensaje);
            return;
          }
        }

        toast.error("No fue posible agendar la cita. Inténtalo de nuevo.");
      }
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
            Tu cita fue registrada en el sistema.
          </p>

          <p className="mt-2 text-sm text-emerald-400">
            Número de cita: {confirmacion.id_cita}
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

  const cargandoCatalogos = cargandoMedicos || cargandoPacientes;
  const errorCatalogos = errorMedicos || errorPacientes;

  return (
    <section className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-surface p-6 text-white shadow-xl sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Agendar cita médica</h1>
        <p className="mt-2 text-sm text-gray-400">
          Completa los datos para programar una nueva cita.
        </p>
      </div>

      {procesandoOptimista && (
        <p role="status" className="mb-4 text-sm text-blue-400">
          Procesando la cita...
        </p>
      )}

      {errorCatalogos && (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {errorCatalogos}
        </p>
      )}

      <form
        onSubmit={handleSubmit(manejarEnvio)}
        noValidate
        className="space-y-5"
      >
        {/* Paciente */}
        <div>
          <label
            htmlFor="id_paciente"
            className="mb-1.5 block text-sm font-medium text-gray-200"
          >
            Paciente
          </label>

          <select
            id="id_paciente"
            {...register("id_paciente", {
              valueAsNumber: true,
            })}
            disabled={cargandoCatalogos || isPending}
            aria-invalid={!!errors.id_paciente}
            className={clasesCampo(!!errors.id_paciente)}
          >
            <option value="">Selecciona un paciente</option>

            {pacientes.map((paciente) => (
              <option key={paciente.id_paciente} value={paciente.id_paciente}>
                {paciente.nombre} {paciente.apellido}
              </option>
            ))}
          </select>

          {errors.id_paciente && (
            <p role="alert" className="mt-1 text-sm text-red-400">
              {errors.id_paciente.message}
            </p>
          )}
        </div>

        {/* Médico */}
        <div>
          <label
            htmlFor="id_doctor"
            className="mb-1.5 block text-sm font-medium text-gray-200"
          >
            Médico
          </label>

          <select
            id="id_doctor"
            {...register("id_doctor", {
              valueAsNumber: true,
            })}
            disabled={cargandoCatalogos || isPending}
            aria-invalid={!!errors.id_doctor}
            className={clasesCampo(!!errors.id_doctor)}
          >
            <option value="">Selecciona un médico</option>

            {medicos.map((medico) => (
              <option key={medico.id_doctor} value={medico.id_doctor}>
                {medico.nombre} {medico.apellido} · {medico.especialidad}
              </option>
            ))}
          </select>

          {errors.id_doctor && (
            <p role="alert" className="mt-1 text-sm text-red-400">
              {errors.id_doctor.message}
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
              disabled={isPending}
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
              disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
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
          disabled={cargandoCatalogos || isPending}
          className="w-full rounded-xl bg-primary px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Agendando..." : "Agendar cita"}
        </button>
      </form>
    </section>
  );
}
