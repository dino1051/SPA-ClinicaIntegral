import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import InputFotoPerfil from "../components/profile/InputFotoPerfil";
import { perfilSchema, type PerfilFormData } from "../schemas/perfil.schema";
import { useAuthStore } from "../stores/useAuthStore";

export default function ProfilePage() {
  const usuario = useAuthStore((state) => state.usuario);
  const actualizarUsuario = useAuthStore((state) => state.actualizarUsuario);

  const [fotoSeleccionada, setFotoSeleccionada] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: {
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
    },
  });

  // Si cambia el usuario del store, sincronizamos el formulario.
  useEffect(() => {
    reset({
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
    });
  }, [usuario, reset]);

  const guardarPerfil = async (datos: PerfilFormData) => {
    try {
      // Por ahora simulamos el guardado en el frontend.
      const foto = fotoSeleccionada
        ? URL.createObjectURL(fotoSeleccionada)
        : usuario.foto;

      actualizarUsuario({
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono ?? "",
        foto,
      });

      setFotoSeleccionada(null);

      toast.success("Perfil actualizado correctamente.");
    } catch {
      toast.error("No fue posible actualizar el perfil.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Encabezado */}
        <div className="mb-8">
          <Link
            to="/usuarios"
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Mi perfil
          </h1>

          <p className="mt-2 text-slate-500">
            Consulta y actualiza tu información personal.
          </p>
        </div>

        {/* Tarjeta del perfil */}
        <form
          onSubmit={handleSubmit(guardarPerfil)}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          {/* Foto */}
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-8 sm:px-10">
            <div className="flex flex-col items-center">
              <InputFotoPerfil
                fotoActual={usuario.foto}
                onChange={setFotoSeleccionada}
              />

              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                {usuario.nombre}
              </h2>

              <p className="mt-1 text-sm text-slate-500">{usuario.email}</p>
            </div>
          </div>

          {/* Información personal */}
          <div className="p-6 sm:p-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-2.5">
                <UserRound className="h-5 w-5 text-indigo-600" />
              </div>

              <div>
                <h2 className="font-semibold text-slate-900">
                  Información personal
                </h2>

                <p className="text-sm text-slate-500">
                  Edita los datos de tu cuenta.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Nombre */}
              <div className="md:col-span-2">
                <label
                  htmlFor="nombre"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Nombre completo
                </label>

                <input
                  id="nombre"
                  type="text"
                  {...register("nombre")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Escribe tu nombre completo"
                />

                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Correo */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Correo electrónico
                </label>

                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="correo@ejemplo.com"
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label
                  htmlFor="telefono"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Teléfono
                </label>

                <input
                  id="telefono"
                  type="tel"
                  {...register("telefono")}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  placeholder="5512345678"
                />

                {errors.telefono && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.telefono.message}
                  </p>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  reset({
                    nombre: usuario.nombre,
                    email: usuario.email,
                    telefono: usuario.telefono,
                  });

                  setFotoSeleccionada(null);
                }}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Descartar cambios
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />

                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
