import { StepIndicator } from "@/components/client/step-indicator";

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

function DocLinePulse({ width }: { width: string }) {
  return <Pulse className={`h-3.5 ${width} mb-2`} />;
}

export default function PrepareLoading() {
  return (
    <>
      <StepIndicator current={4} />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Breadcrumb skeleton */}
        <Pulse className="h-4 w-32 mb-5" />

        {/* Header */}
        <div className="mb-6">
          <Pulse className="h-3 w-48 mb-3" />
          <Pulse className="h-8 w-80 mb-2" />
          <Pulse className="h-4 w-full max-w-lg" />
        </div>

        {/* Tab bar skeleton */}
        <div className="mb-8 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 w-fit">
          <Pulse className="h-8 w-28 rounded-lg" />
          <Pulse className="h-8 w-24 rounded-lg" />
          <Pulse className="h-8 w-36 rounded-lg" />
        </div>

        {/* AI thinking card */}
        <div className="mb-8 rounded-xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 shadow shadow-indigo-600/30">
              <svg className="h-5 w-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-indigo-800">Drafting your Plaintiff&apos;s Claim…</p>
              <p className="text-xs text-indigo-600 mt-0.5">
                Writing Form 7A with statute citations and building your evidence checklist.
              </p>
            </div>
          </div>

          <div className="space-y-2 pl-1">
            {[
              "Composing reasons for claim",
              "Citing applicable provisions",
              "Drafting relief sought",
              "Building evidence checklist",
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-indigo-700">
                <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                {step}
              </div>
            ))}
          </div>
        </div>

        {/* Two-column skeleton */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left — Form 7A document skeleton */}
          <div className="rounded-xl border border-slate-300 bg-white shadow-sm overflow-hidden">
            {/* Doc header */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 text-center space-y-2">
              <Pulse className="h-2.5 w-40 mx-auto" />
              <Pulse className="h-5 w-32 mx-auto" />
              <Pulse className="h-2.5 w-24 mx-auto" />
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* Parties */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Pulse className="h-2.5 w-16" />
                  <Pulse className="h-4 w-28" />
                </div>
                <div className="space-y-1.5">
                  <Pulse className="h-2.5 w-20" />
                  <Pulse className="h-4 w-32" />
                  <Pulse className="h-3 w-40" />
                </div>
              </div>

              {/* Court / amount */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Pulse className="h-2.5 w-24" />
                  <Pulse className="h-4 w-36" />
                </div>
                <div className="space-y-1.5">
                  <Pulse className="h-2.5 w-28" />
                  <Pulse className="h-6 w-24" />
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-2">
                <Pulse className="h-2.5 w-52 mb-3" />
                <DocLinePulse width="w-full" />
                <DocLinePulse width="w-5/6" />
                <DocLinePulse width="w-full" />
                <DocLinePulse width="w-4/6" />
                <DocLinePulse width="w-full" />
                <DocLinePulse width="w-3/4" />
              </div>

              {/* Relief */}
              <div className="space-y-2">
                <Pulse className="h-2.5 w-28 mb-3" />
                <DocLinePulse width="w-3/4" />
                <DocLinePulse width="w-2/3" />
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
              <Pulse className="h-2.5 w-72" />
            </div>
          </div>

          {/* Right — evidence checklist skeleton */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 flex items-center justify-between">
              <Pulse className="h-4 w-36" />
              <Pulse className="h-3 w-12" />
            </div>
            <div className="px-5 py-4 space-y-4">
              {[3, 2, 2].map((count, groupIdx) => (
                <div key={groupIdx}>
                  <Pulse className="h-3 w-40 mb-2" />
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="flex items-start gap-3 mb-2.5">
                      <Pulse className="h-4 w-4 rounded mt-0.5 shrink-0" />
                      <div className="flex-1 space-y-1">
                        <Pulse className="h-3.5 w-full" />
                        <Pulse className="h-2.5 w-4/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
