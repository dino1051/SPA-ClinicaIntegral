import type { Paciente } from "../../types/pacientes";

interface PatientStatsProps {
  pacientes: Paciente[];
}

export function PatientStats({ pacientes }: PatientStatsProps) {
  const total = pacientes.length;

  const activos = pacientes.filter(
    (paciente) => paciente.estado === "activo",
  ).length;

  const inactivos = pacientes.filter(
    (paciente) => paciente.estado === "inactivo",
  ).length;

  const enEspera = pacientes.filter(
    (paciente) => paciente.estado === "en_espera",
  ).length;

  const estadisticas = [
    { titulo: "Total pacientes", valor: total },
    { titulo: "Activos", valor: activos },
    { titulo: "Inactivos", valor: inactivos },
    { titulo: "En espera", valor: enEspera },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {estadisticas.map((estadistica) => (
        <article
          key={estadistica.titulo}
          className="rounded-xl bg-white p-4 shadow-sm"
        >
          <p className="text-sm text-slate-500">{estadistica.titulo}</p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {estadistica.valor}
          </p>
        </article>
      ))}
    </section>
  );
}
