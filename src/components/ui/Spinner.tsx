interface SpinnerProps {
  fullscreen?: boolean;
  mensaje?: string;
}

export default function Spinner({ fullscreen = false, mensaje }: SpinnerProps) {
  const indicador = (
    <div
      className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
      role="status"
      aria-label="Cargando"
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
        <div className="flex flex-col items-center gap-3 text-blue-600">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          {mensaje && (
            <p className="text-sm font-medium text-slate-600">{mensaje}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-blue-600">
      {indicador}
      {mensaje && <span className="text-sm text-slate-600">{mensaje}</span>}
    </span>
  );
}
