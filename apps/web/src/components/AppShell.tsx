import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Board" },
  { to: "/list", label: "List" },
  { to: "/stats", label: "Stats" },
  { to: "/settings", label: "Settings" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6">
      <header className="enter-up mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="enter-slide-right">
          <Link to="/" className="brand-mark font-display text-4xl tracking-tight md:text-5xl">
            Docket
          </Link>
          <p className="enter-fade delay-1 mt-1 text-sm text-[var(--color-ink-muted)]">
            Job application tracker
          </p>
        </div>
        <nav className="enter-scale delay-2 flex gap-1 rounded-lg border border-[var(--color-line)] bg-white/80 p-1 shadow-sm backdrop-blur-sm">
          {nav.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "nav-pill rounded-md px-3 py-1.5 text-sm",
                  active
                    ? "nav-pill-active bg-[var(--color-accent)] text-white"
                    : "text-[var(--color-ink-muted)]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main key={pathname} className="page-enter">
        {children}
      </main>
    </div>
  );
}
