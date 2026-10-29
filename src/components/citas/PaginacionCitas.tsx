interface PaginacionCitasProps {
  paginaActual: number;
  totalPaginas: number;
  cambiarPagina: (pagina: number) => void;
}

export default function PaginacionCitas({
  paginaActual,
  totalPaginas,
  cambiarPagina,
}: PaginacionCitasProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-500">
        Página {paginaActual} de {totalPaginas}
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => cambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-gray-100 transition"
        >
          Anterior
        </button>

        {Array.from({ length: totalPaginas }, (_, index) => index + 1).map(
          (pagina) => (
            <button
              key={pagina}
              onClick={() => cambiarPagina(pagina)}
              className={`w-9 h-9 rounded-lg text-sm transition ${
                paginaActual === pagina
                  ? "bg-green-600 text-white"
                  : "border border-gray-200 hover:bg-gray-100"
              }`}
            >
              {pagina}
            </button>
          ),
        )}

        <button
          onClick={() => cambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200
          disabled:opacity-40 disabled:cursor-not-allowed
          hover:bg-gray-100 transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
