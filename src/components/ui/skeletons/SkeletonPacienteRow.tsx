export default function SkeletonPacienteRow() {
  return (
    <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4">
      <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200" />

      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 w-36 max-w-full animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-48 max-w-full animate-pulse rounded bg-slate-100" />
      </div>

      <div className="hidden h-4 w-28 animate-pulse rounded bg-slate-200 sm:block" />

      <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />

      <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
    </div>
  );
}
