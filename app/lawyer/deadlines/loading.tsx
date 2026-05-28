function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

function TierSkeleton({ rows }: { rows: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 flex items-center gap-2">
        <Pulse className="h-2 w-2 rounded-full" />
        <Pulse className="h-3 w-32" />
      </div>
      <ul className="divide-y divide-slate-50">
        {[...Array(rows)].map((_, i) => (
          <li key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="flex-1 space-y-1.5">
              <Pulse className="h-4 w-40" />
              <Pulse className="h-3 w-56" />
              <Pulse className="h-3 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-8 w-8 rounded-lg" />
              <Pulse className="h-8 w-8 rounded-lg" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function DeadlineGuardianLoading() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <Pulse className="h-7 w-48 mb-2" />
        <Pulse className="h-4 w-72" />
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 text-center space-y-2">
            <Pulse className="h-8 w-12 mx-auto" />
            <Pulse className="h-3 w-28 mx-auto" />
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <TierSkeleton rows={1} />
        <TierSkeleton rows={2} />
        <TierSkeleton rows={3} />
      </div>
    </main>
  );
}
