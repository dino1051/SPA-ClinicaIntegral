import { useCallback, useState } from "react";

interface UseApiState<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [estado, setEstado] = useState<UseApiState<T>>({
    data: null,
    cargando: false,
    error: null,
  });

  const ejecutar = useCallback(
    async (peticion: () => Promise<T>): Promise<T> => {
      setEstado((actual) => ({
        ...actual,
        cargando: true,
        error: null,
      }));

      try {
        const resultado = await peticion();

        setEstado({
          data: resultado,
          cargando: false,
          error: null,
        });

        return resultado;
      } catch (error: unknown) {
        setEstado((actual) => ({
          ...actual,
          cargando: false,
          error: "No fue posible completar la petición.",
        }));

        throw error;
      }
    },
    [],
  );

  return {
    ...estado,
    ejecutar,
  };
}
