interface SkeletonMetricCardProps {
  cantidad?: number;
}

export default function SkeletonMetricCard({
  cantidad = 1,
}: SkeletonMetricCardProps) {
  return (
    <>
      {Array.from({ length: cantidad }).map((_, index) => (
        <article
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-9 w-16 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </article>
      ))}
    </>
  );
}
