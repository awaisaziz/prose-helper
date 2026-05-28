import { StepIndicator } from "@/components/client/step-indicator";

function Pulse({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export default function AssessLoading() {
  return (
    <>
      <StepIndicator current={3} />

      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Breadcrumb skeleton */}
        <Pulse className="h-4 w-32 mb-5" />

        {/* Header */}
        <div className="mb-8">
          <Pulse className="h-3 w-40 mb-3" />
          <Pulse className="h-8 w-72 mb-4" />

          {/* AI thinking card */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              {/* Spinning cog */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 shadow shadow-blue-600/30">
                <svg className="h-5 w-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg"
                  fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-800">Analyzing your legal framework…</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  Identifying applicable statutes, rules, and case law. This takes a few seconds.
                </p>
              </div>
            </div>

            {/* Animated steps */}
            <div className="space-y-2 pl-1">
              {[
                { label: "Identifying governing statutes", delay: "delay-0" },
                { label: "Matching procedural rules", delay: "delay-150" },
                { label: "Retrieving comparable decisions", delay: "delay-300" },
                { label: "Assessing case strength", delay: "delay-500" },
              ].map((step, i) => (
                <div key={i} className={`flex items-center gap-2 text-xs text-blue-700 ${step.delay}`}>
                  <span className="flex h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  {step.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two-column skeleton */}
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left — framework skeleton */}
          <div className="space-y-3">
            <Pulse className="h-4 w-48 mb-1" />
            {/* 4 accordion sections */}
            {["Statutes", "Rules of Procedure", "Regulations", "Precedents"].map((label) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Pulse className="h-4 w-4 rounded" />
                    <Pulse className="h-4 w-32" />
                  </div>
                  <Pulse className="h-3 w-16" />
                </div>
              </div>
            ))}
            {/* Rights card skeleton */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <Pulse className="h-3 w-36 mb-1" />
              <Pulse className="h-4 w-full" />
              <Pulse className="h-4 w-5/6" />
              <Pulse className="h-4 w-3/4" />
            </div>
          </div>

          {/* Right — strength skeleton */}
          <div className="space-y-5">
            <Pulse className="h-4 w-28 mb-1" />
            <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
              {/* Big strength pill */}
              <div className="flex justify-center">
                <Pulse className="h-12 w-32 rounded-full" />
              </div>
              <Pulse className="h-3 w-full" />
              <Pulse className="h-3 w-5/6" />
              <Pulse className="h-3 w-4/6" />
              <Pulse className="h-3 w-5/6" />
            </div>
            <Pulse className="h-11 w-full rounded-xl" />
            <Pulse className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </main>
    </>
  );
}
