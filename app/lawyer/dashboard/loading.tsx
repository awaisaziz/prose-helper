function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export default function DashboardLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <Pulse className="h-3 w-28 mb-3" />
        <Pulse className="h-8 w-48 mb-2" />
        <Pulse className="h-4 w-96" />
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[0,1,2,3].map((i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-center">
            <Pulse className="h-9 w-12 mx-auto mb-2" />
            <Pulse className="h-3 w-24 mx-auto" />
          </div>
        ))}
      </div>

      {/* Queue skeleton */}
      <div className="space-y-3">
        {[0,1,2].map((i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Pulse className="h-5 w-20 rounded-full" />
                  <Pulse className="h-5 w-20 rounded-full" />
                  <Pulse className="h-5 w-24 rounded-full" />
                </div>
                <Pulse className="h-5 w-40" />
                <Pulse className="h-4 w-full" />
                <Pulse className="h-4 w-5/6" />
                <Pulse className="h-3.5 w-48" />
              </div>
              <Pulse className="h-8 w-20 rounded-xl shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
