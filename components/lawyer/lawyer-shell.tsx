import Link from "next/link";
import { Disclaimer } from "@/components/disclaimer";
import { Scale } from "lucide-react";

const NAV = [
  { href: "/lawyer/dashboard", label: "Dashboard" },
  { href: "/lawyer/deadlines", label: "Deadlines" },
] as const;

export function LawyerShell({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-600 text-white shadow-lg shadow-violet-600/25">
              <Scale className="size-4" aria-hidden />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">
                Lawyer Console
              </p>
              <p className="hidden text-[10px] text-muted-foreground sm:block">
                Pro Se Helper · Ontario Small Claims
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="ml-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {children}

        <div className="mt-10 max-w-2xl">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
