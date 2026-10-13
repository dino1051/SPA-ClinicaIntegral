import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Paciente, EstadoPaciente } from "../../types/pacientes";

interface PatientFormModalProps {
  paciente: Paciente | null;
  especialidades: string[];
  onCerrar: () => void;
  onGuardar: (paciente: Paciente) => void;
}

type FormularioPaciente = Omit<Paciente, "id">;

const formularioVacio: FormularioPaciente = {
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
  especialidadAsignada: "",
  ultimaCita: "",
  estado: "activo",
};

export function PatientFormModal({
  paciente,
  especialidades,
  onCerrar,
  onGuardar,
}: PatientFormModalProps) {
  const [formulario, setFormulario] =
    useState<FormularioPaciente>(formularioVacio);

  useEffect(() => {
    if (paciente) {
      const { id, ...datos } = paciente;
      setFormulario(datos);
    } else {
      setFormulario(formularioVacio);
    }
  }, [paciente]);

  function actualizarCampo(campo: keyof FormularioPaciente, valor: string) {
    setFormulario((actual) => ({
      ...actual,
      [campo]: valor,
    }));
  }

  function manejarEnvio(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const datos: Paciente = {
      id: paciente?.id ?? crypto.randomUUID(),
      ...formulario,
    };

    onGuardar(datos);
  }

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

        <form onSubmit={manejarEnvio}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-gray-300">
              Nombre
              <input
                required
                value={formulario.nombre}
                onChange={(e) => actualizarCampo("nombre", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary"
                placeholder="Nombre"
              />
            </label>

            <label className="space-y-1 text-sm text-gray-300">
              Apellido
              <input
                required
                value={formulario.apellido}
                onChange={(e) => actualizarCampo("apellido", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary"
                placeholder="Apellido"
              />
            </label>

            <label className="space-y-1 text-sm text-gray-300 sm:col-span-2">
              Correo electrónico
              <input
                required
                type="email"
                value={formulario.email}
                onChange={(e) => actualizarCampo("email", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary"
                placeholder="paciente@correo.com"
              />
            </label>

            <label className="space-y-1 text-sm text-gray-300">
              Teléfono
              <input
                required
                type="tel"
                value={formulario.telefono}
                onChange={(e) => actualizarCampo("telefono", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary"
                placeholder="Número de teléfono"
              />
            </label>

            <label className="space-y-1 text-sm text-gray-300">
              Estado
              <select
                value={formulario.estado}
                onChange={(e) =>
                  actualizarCampo("estado", e.target.value as EstadoPaciente)
                }
                className="w-full rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-white outline-none focus:border-primary"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="en_espera">En espera</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-gray-300 sm:col-span-2">
              Especialidad asignada
              <input
                list="especialidades-pacientes"
                value={formulario.especialidadAsignada}
                onChange={(e) =>
                  actualizarCampo("especialidadAsignada", e.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary"
                placeholder="Selecciona o escribe una especialidad"
              />
              <datalist id="especialidades-pacientes">
                {especialidades.map((especialidad) => (
                  <option key={especialidad} value={especialidad} />
                ))}
              </datalist>
            </label>

            <label className="space-y-1 text-sm text-gray-300 sm:col-span-2">
              Última cita
              <input
                type="date"
                value={formulario.ultimaCita}
                onChange={(e) => actualizarCampo("ultimaCita", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-primary"
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
              className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {paciente ? "Guardar cambios" : "Crear paciente"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
