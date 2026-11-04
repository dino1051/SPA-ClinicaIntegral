interface SpinnerProps {
  fullscreen?: boolean;
}

export default function Spinner({ fullscreen = false }: SpinnerProps) {
  const spinner = (
    <div
      className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"
      role="status"
      aria-label="Cargando"
    />
  );

  if (fullscreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center py-8">{spinner}</div>;
}
