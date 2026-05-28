"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LawyerNotificationBell } from "@/components/lawyer/lawyer-notification-bell";

const NAV = [
  {
    href: "/lawyer/dashboard",
    label: "Dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
      </svg>
    ),
  },
  {
    href: "/lawyer/triage",
    label: "Triage Inbox",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4" />
      </svg>
    ),
  },
  {
    href: "/lawyer/deadlines",
    label: "Deadline Guardian",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    href: "/lawyer/clients",
    label: "Clients",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    href: "/lawyer/billing",
    label: "Billing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export function LawyerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-slate-900 text-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-slate-700/50 px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 shadow shadow-indigo-600/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M3 12h18M3 18h12" />
            </svg>
          </div>
          <span className="text-sm font-bold tracking-tight">Pro Se Helper</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          Lawyer Console
        </p>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${active
                  ? "bg-indigo-600 text-white shadow shadow-indigo-600/30"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
            >
              <span className="shrink-0">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Profile + identity */}
      <div className="border-t border-slate-700/50 px-3 py-3 space-y-0.5">
        {/* Notification bell row */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs font-medium text-slate-500">Notifications</span>
          <LawyerNotificationBell />
        </div>

        <Link
          href="/lawyer/profile"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
            ${pathname === "/lawyer/profile"
              ? "bg-indigo-600 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          My Profile
        </Link>

        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 mt-1">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-extrabold text-white">
            JA
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Jordan Avery</p>
            <p className="text-[10px] text-slate-500 truncate">Lawyer · Demo</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

