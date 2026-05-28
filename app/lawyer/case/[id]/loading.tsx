function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export default function CaseReviewLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Pulse className="h-4 w-28 mb-5" />

      {/* Case header */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex gap-2">
              <Pulse className="h-5 w-24 rounded-full" />
              <Pulse className="h-5 w-28 rounded-full" />
            </div>
            <Pulse className="h-7 w-56" />
            <Pulse className="h-4 w-40" />
          </div>
          <div className="text-right space-y-2">
            <Pulse className="h-3 w-24 ml-auto" />
            <Pulse className="h-9 w-32 ml-auto" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
          <Pulse className="h-3 w-36" />
          <Pulse className="h-4 w-full" />
          <Pulse className="h-4 w-4/5" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <Pulse className="h-3 w-28" />
            <Pulse className="h-8 w-36 rounded-full" />
            <Pulse className="h-4 w-full" />
            <Pulse className="h-4 w-5/6" />
            <Pulse className="h-4 w-4/6" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
            <Pulse className="h-3 w-24" />
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => <Pulse key={i} className="h-4 w-full" />)}
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <Pulse className="h-3 w-32" />
            <Pulse className="h-12 w-full rounded-xl" />
            <Pulse className="h-12 w-full rounded-xl" />
            <Pulse className="h-12 w-full rounded-xl" />
            <Pulse className="h-20 w-full rounded-xl" />
            <Pulse className="h-11 w-full rounded-xl" />
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <Pulse className="h-3 w-24" />
            <Pulse className="h-10 w-full rounded-xl" />
            <Pulse className="h-10 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
