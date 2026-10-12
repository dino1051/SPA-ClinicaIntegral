import { useState } from "react";
import type { Metrica } from "./types";
import { CardMetrica } from "./components/MetricCard";
import "./App.css";

function App() {
  const Metricas = [
    {
      id: "1",
      titulo: "Pacientes",
      valor: "valor",
      descripcion: "descripcion",
      tendencia: "positiva",
      icono: "icono",
    },
    {
      id: "2",
      titulo: "Citas Hoy",
      valor: "valor",
      descripcion: "descripcion",
      tendencia: "negativa",
      icono: "icono",
    },
    {
      id: "3",
      titulo: "Pendientes",
      valor: "valor",
      descripcion: "descripcion",
      tendencia: "neutra",
      icono: "icono",
    },
    {
      id: "4",
      titulo: "Disponibilidad",
      valor: "valor",
      descripcion: "descripcion",
      tendencia: "positiva",
      icono: "icono",
    },
  ];

  const [metricas, setMetricas] = useState<Metrica[]>([
    {
      id: "1",
      titulo: "Pacientes",
      valor: 20,
      descripcion: "descripcion",
      tendencia: "positiva",
      icono: "icono",
    },
    {
      id: "2",
      titulo: "Citas Hoy",
      valor: "valor",
      descripcion: "descripcion",
      tendencia: "negativa",
      icono: "icono",
    },
    {
      id: "3",
      titulo: "Pendientes",
      valor: "valor",
      descripcion: "descripcion",
      tendencia: "neutra",
      icono: "icono",
    },
    {
      id: "4",
      titulo: "Disponibilidad",
      valor: "valor",
      descripcion: "descripcion",
      tendencia: "positiva",
      icono: "icono",
    },
  ]);

  const [pacientes, setPacientes] = useState(128);

  const incrementarPacientes = () => setPacientes((prev) => prev + 1);

  return (
    <div>
      <div>
        {metricas.map((p) => (
          <CardMetrica
            id={p.id}
            titulo={p.titulo}
            valor={p.valor}
            descripcion={p.descripcion}
            tendencia={p.tendencia}
            icono={p.icono}
          ></CardMetrica>
        ))}
      </div>

      <div>
        <h1>USO DE ESTADOS BASICOS</h1>
        <button
          className="px-4 py-2 bg-indigo-800 text-white"
          onClick={incrementarPacientes}
        >
          AGREGAR PACIENTE
        </button>

        <div className="grid grid-cols-2 bg-amber-900 gap-5">
          {metricas.map((p) => (
            <CardMetrica
              id={p.id}
              titulo={p.titulo}
              valor={p.valor}
              descripcion={p.descripcion}
              tendencia={p.tendencia}
              icono={p.icono}
            ></CardMetrica>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
