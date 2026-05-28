import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pro Se Helper — Ontario Small Claims AI Co-Counsel",
  description:
    "AI co-counsel for self-represented litigants in Ontario Small Claims Court. Draft claims, know your rights, get lawyer sign-off.",
};

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden selection:bg-indigo-500/40">
      {/* ── Ambient background glows ── */}
      <div aria-hidden className="pointer-events-none select-none fixed inset-0 z-0">
        <div className="absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full bg-indigo-700/25 blur-[140px]" />
        <div className="absolute top-10 right-1/4 w-[360px] h-[360px] rounded-full bg-violet-700/20 blur-[120px]" />
      </div>

      {/* ══════════════════════════════════════
          NAV
      ══════════════════════════════════════ */}
      <header className="relative z-20 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          {/* Brand — left side */}
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/30">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6h18M3 12h18M3 18h12"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="text-sm font-bold text-white tracking-tight">
                Pro Se Helper
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wide">
                Ontario Small Claims AI Co-Counsel
              </span>
            </div>
          </div>

          {/* Right side — status pill */}
          <div className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-400" />
            </span>
            Demo
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl">
          {/* Eyebrow */}
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-indigo-400">
            Ontario Small Claims Court · Disputes up to $50,000
          </p>

          {/* Headline */}
          <h1 className="text-center text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
              Your AI co-counsel
            </span>
            <br />
            <span className="text-slate-300 font-light">for Small Claims Court.</span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mt-5 max-w-xl text-center text-base text-slate-300 leading-relaxed">
            Pro Se Helper guides self-represented litigants through every step of an
            Ontario debt or money dispute — from rights assessment to a lawyer-reviewed
            Plaintiff&apos;s Claim (Form 7A).
          </p>

          {/* ── Portal cards ── */}
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {/* Client */}
            <Link
              href="/client/dashboard"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 backdrop-blur-sm"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-indigo-600/8 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* Icon row */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 transition-all duration-300 group-hover:bg-indigo-500 group-hover:text-white group-hover:border-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400/70">
                  Client Portal
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2 transition-colors group-hover:text-indigo-200">
                  I&apos;m a Client
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Describe your dispute, understand your legal rights and remedies under
                  Ontario law, and build your Plaintiff&apos;s Claim — ready for lawyer
                  sign-off.
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Guided dispute intake",
                    "Rights & remedies breakdown",
                    "Form 7A claim builder",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-indigo-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-indigo-400 transition-colors group-hover:text-indigo-300">
                Enter Client Portal
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>

            {/* Lawyer */}
            <Link
              href="/lawyer/dashboard"
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10 backdrop-blur-sm"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-violet-600/8 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              {/* Icon row */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/20 text-violet-400 transition-all duration-300 group-hover:bg-violet-500 group-hover:text-white group-hover:border-violet-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400/70">
                  Lawyer Console
                </span>
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-2 transition-colors group-hover:text-violet-200">
                  I&apos;m a Lawyer
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  Review client-submitted claims, verify every legal citation, approve
                  filings, and track all active procedural deadlines with the Deadline
                  Guardian.
                </p>
                <ul className="space-y-1.5">
                  {[
                    "Client review queue",
                    "Citation verification",
                    "Deadline Guardian",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-slate-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-violet-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-violet-400 transition-colors group-hover:text-violet-300">
                Open Lawyer Console
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="mt-10 max-w-2xl mx-auto">
            <Disclaimer />
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="relative z-10 border-t border-slate-800/60 py-6 px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center sm:flex-row sm:text-left">
          <span className="text-xs text-slate-400 font-medium">
            Pro Se Helper — a Lexiden product
          </span>
          <span className="text-xs text-slate-500">
            © {new Date().getFullYear()} Pro Se Helper. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
