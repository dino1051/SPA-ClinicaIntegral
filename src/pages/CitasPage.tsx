import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import PaginacionCitas from "../components/citas/PaginacionCitas";

import { obtenerCitas } from "../services/citas";
import type { Cita } from "../types/citas.ts";
import TablaCitas from "../components/citas/TablaCitas";
import FiltrosCitas from "../components/citas/FiltrosCitas";
import type { EstadoCita } from "../types/citas";

export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [cargando, setCargando] = useState(true);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState<EstadoCita | "TODAS">("TODAS");
  const [doctorId, setDoctorId] = useState("TODOS");
  const [fecha, setFecha] = useState("");
  useEffect(() => {
    let activo = true;

    async function cargarCitas() {
      try {
        setCargando(true);

        const datos = await obtenerCitas();

        console.log("Citas recibidas:", datos);

        if (activo) {
          setCitas(datos);
        }
      } catch (error) {
        console.error("Error al cargar citas:", error);

        if (activo) {
          toast.error("No fue posible cargar las citas.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarCitas();

    return () => {
      activo = false;
    };
  }, []);
  const doctores = Array.from(
    new Map(citas.map((cita) => [cita.doctor.id_doctor, cita.doctor])).values(),
  );
  const citasFiltradas = citas.filter((cita) => {
    const nombrePaciente =
      `${cita.paciente.nombre} ${cita.paciente.apellido}`.toLowerCase();

    const coincideBusqueda = nombrePaciente.includes(
      busqueda.trim().toLowerCase(),
    );

    const coincideEstado = estado === "TODAS" || cita.estado === estado;

    const coincideDoctor =
      doctorId === "TODOS" || cita.id_doctor === Number(doctorId);

    const coincideFecha = !fecha || cita.fecha.slice(0, 10) === fecha;

    return (
      coincideBusqueda && coincideEstado && coincideDoctor && coincideFecha
    );
  });

  const citasPorPagina = 8;

  const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);

  const indiceInicial = (paginaActual - 1) * citasPorPagina;
  const indiceFinal = indiceInicial + citasPorPagina;

  const citasPaginadas = citasFiltradas.slice(indiceInicial, indiceFinal);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, estado, doctorId, fecha]);
  const total = citas.length;
  const programadas = citas.filter(
    (cita) => cita.estado === "PROGRAMADA",
  ).length;
  const completadas = citas.filter(
    (cita) => cita.estado === "COMPLETADA",
  ).length;
  const canceladas = citas.filter((cita) => cita.estado === "CANCELADA").length;

  const estadisticas = [
    {
      titulo: "Total de citas",
      valor: total,
      icono: CalendarDays,
      estilo: "bg-indigo-50 text-indigo-600",
    },
    {
      titulo: "Programadas",
      valor: programadas,
      icono: Clock3,
      estilo: "bg-blue-50 text-blue-600",
    },
    {
      titulo: "Completadas",
      valor: completadas,
      icono: CheckCircle2,
      estilo: "bg-green-50 text-green-600",
    },
    {
      titulo: "Canceladas",
      valor: canceladas,
      icono: XCircle,
      estilo: "bg-red-50 text-red-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Gestión de citas
            </h1>

            <p className="mt-2 text-slate-500">
              Consulta y administra las citas médicas.
            </p>
          </div>
        </header>

        {/* Estadísticas */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {estadisticas.map((item) => {
            const Icono = item.icono;

            return (
              <article
                key={item.titulo}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.titulo}</p>

                    <p className="mt-2 text-3xl font-bold text-slate-900">
                      {item.valor}
                    </p>
                  </div>

                  <div className={`rounded-xl p-3 ${item.estilo}`}>
                    <Icono className="h-6 w-6" />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Tabla */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Todas las citas
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Consulta las citas registradas en el sistema.
            </p>
          </div>
          <FiltrosCitas
            busqueda={busqueda}
            estado={estado}
            doctorId={doctorId}
            fecha={fecha}
            doctores={doctores}
            onBusquedaChange={setBusqueda}
            onEstadoChange={setEstado}
            onDoctorChange={setDoctorId}
            onFechaChange={setFecha}
            onLimpiar={() => {
              setBusqueda("");
              setEstado("TODAS");
              setDoctorId("TODOS");
              setFecha("");
              setPaginaActual(1);
            }}
          />
          {cargando ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
              Cargando citas...
            </div>
          ) : citasFiltradas.length > 0 ? (
            <>
              <TablaCitas citas={citasPaginadas} />

              <PaginacionCitas
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                cambiarPagina={setPaginaActual}
              />
            </>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <CalendarDays className="mx-auto mb-3 h-10 w-10 text-slate-300" />

              <h3 className="font-semibold text-slate-700">
                No se encontraron citas
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Intenta modificar los filtros de búsqueda.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
