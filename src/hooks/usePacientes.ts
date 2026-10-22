import { useEffect, useState } from "react";
import { api } from "../lib/axios";

export interface Paciente {
  id_paciente: string;
  nombre: string;
  apellido: string;
  activo: boolean;
}

export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarPacientes() {
      try {
        const respuesta = await api.get<Paciente[]>("/pacientes");

        if (activo) {
          setPacientes(respuesta.data.filter((paciente) => paciente.activo));
        }
      } catch {
        if (activo) {
          setError("No fue posible cargar los pacientes.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarPacientes();

    return () => {
      activo = false;
    };
  }, []);

  return { pacientes, cargando, error };
}
