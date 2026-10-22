import { useEffect, useState } from "react";
import { api } from "../lib/axios";

export interface Medico {
  id_doctor: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  activo: boolean;
}

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;

    async function cargarMedicos() {
      try {
        const respuesta = await api.get<Medico[]>("/doctores");

        if (activo) {
          setMedicos(respuesta.data.filter((medico) => medico.activo));
        }
      } catch {
        if (activo) {
          setError("No fue posible cargar los médicos.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    void cargarMedicos();

    return () => {
      activo = false;
    };
  }, []);

  return { medicos, cargando, error };
}
