import { useEffect, useState } from "react";

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
}

const medicosSimulados: Medico[] = [
  {
    id: "med-1",
    nombre: "Laura Martínez",
    especialidad: "Medicina general",
  },
  {
    id: "med-2",
    nombre: "Carlos Hernández",
    especialidad: "Cardiología",
  },
  {
    id: "med-3",
    nombre: "Sofía Ramírez",
    especialidad: "Pediatría",
  },
  {
    id: "med-4",
    nombre: "Andrés Torres",
    especialidad: "Dermatología",
  },
];

export function useMedicos() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(medicosSimulados);
      setCargando(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return { medicos, cargando };
}
