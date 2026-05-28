import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";

export function ViewToggle() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isClient = pathname.startsWith("/client");

  const lawyerRef = useRef<HTMLButtonElement>(null);
  const clientRef = useRef<HTMLButtonElement>(null);
  const [dims, setDims] = useState<{ x: number; w: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const node = isClient ? clientRef.current : lawyerRef.current;
      if (!node) return;
      setDims({ x: node.offsetLeft, w: node.offsetWidth });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (lawyerRef.current) ro.observe(lawyerRef.current);
    if (clientRef.current) ro.observe(clientRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isClient]);

  return (
    <div className="relative flex items-center rounded-full border border-hairline bg-fog p-1 text-[12px]">
      {dims && (
        <motion.div
          aria-hidden
          initial={false}
          animate={{ x: dims.x - 4, width: dims.w }}
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
          className="absolute top-1 bottom-1 left-1 rounded-full bg-canvas shadow-sm ring-1 ring-hairline"
        />
      )}
      <button
        ref={lawyerRef}
        onClick={() => navigate({ to: "/" })}
        className={`relative z-10 px-4 py-1.5 font-medium transition-colors ${
          !isClient ? "text-ink" : "text-ink-faint"
        }`}
      >
        Lawyer Desk
      </button>
      <button
        ref={clientRef}
        onClick={() => navigate({ to: "/client" })}
        className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 font-medium transition-colors ${
          isClient ? "text-ink" : "text-ink-faint"
        }`}
      >
        <span>Client Portal</span>
        <span className="rounded-full bg-warm-mist px-1.5 py-px text-[9px] uppercase tracking-wider text-ink">
          Live
        </span>
      </button>
    </div>
  );
}

const NAV: { to: "/" | "/matters" | "/intake" | "/billing" | "/calendar"; label: string; exact?: boolean }[] = [

  { to: "/", label: "Overview", exact: true },
  { to: "/matters", label: "Matters" },
  { to: "/intake", label: "Intake" },
  { to: "/billing", label: "Billing" },
  { to: "/calendar", label: "Calendar" },
];

export function PrimaryNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isClientView = pathname.startsWith("/client");

  return (
    <nav className="hidden items-center gap-1 md:flex">
      {NAV.map((item) => {
        const active =
          !isClientView &&
          (item.exact ? pathname === item.to : pathname.startsWith(item.to));
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`rounded-md px-3 py-1.5 text-[13px] transition-colors ${
              active ? "bg-fog text-ink" : "text-ink-soft hover:bg-fog hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

