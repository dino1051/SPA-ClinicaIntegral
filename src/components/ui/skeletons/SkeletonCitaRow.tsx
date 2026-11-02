export default function SkeletonCitaRow() {
  return (
    <div className="grid grid-cols-2 gap-4 border-b border-slate-100 px-5 py-5 sm:grid-cols-4">
      <div className="space-y-2">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />
        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}
