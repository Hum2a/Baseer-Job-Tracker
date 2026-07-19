import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Application, Reminder } from "@docket/shared";
import { isReminderDueSoon } from "@docket/shared";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Filter = "open" | "completed" | "all";

type Props = {
  reminders: Reminder[];
  applications: Application[];
  loading?: boolean;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function AllRemindersPanel({
  reminders,
  applications,
  loading,
  onToggle,
  onDelete,
}: Props) {
  const [filter, setFilter] = useState<Filter>("open");
  const [busyId, setBusyId] = useState<string | null>(null);

  const appById = useMemo(
    () => new Map(applications.map((a) => [a.id, a])),
    [applications],
  );

  const filtered = useMemo(() => {
    let rows = [...reminders];
    if (filter === "open") rows = rows.filter((r) => !r.completed);
    if (filter === "completed") rows = rows.filter((r) => r.completed);
    return rows.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [reminders, filter]);

  const openCount = reminders.filter((r) => !r.completed).length;
  const completedCount = reminders.filter((r) => r.completed).length;

  const toggle = async (id: string, completed: boolean) => {
    setBusyId(id);
    try {
      await onToggle(id, completed);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="enter-up space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Reminders</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            All follow-ups across applications. Toggle complete to clear them from
            the daily digest.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg border border-[var(--color-line)] bg-white/80 p-1">
          {(
            [
              ["open", `Open (${openCount})`],
              ["completed", `Done (${completedCount})`],
              ["all", `All (${reminders.length})`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={cn(
                "nav-pill rounded-md px-3 py-1.5 text-sm",
                filter === key
                  ? "nav-pill-active bg-[var(--color-accent)] text-white"
                  : "text-[var(--color-ink-muted)]",
              )}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-ink-muted)]">Loading reminders…</p>
      ) : filtered.length === 0 ? (
        <div className="enter-scale rounded-xl border border-dashed border-[var(--color-line)] bg-white/60 px-6 py-10 text-center text-sm text-[var(--color-ink-muted)]">
          {reminders.length === 0
            ? "No reminders yet. Add them from an application’s detail page."
            : filter === "open"
              ? "No open reminders."
              : filter === "completed"
                ? "No completed reminders."
                : "No reminders."}
        </div>
      ) : (
        <ul className="stagger-fast space-y-2">
          {filtered.map((r) => {
            const app = appById.get(r.applicationId);
            const due = isReminderDueSoon(r.dueDate, r.completed);
            const overdue =
              !r.completed && new Date(r.dueDate).getTime() < Date.now();
            return (
              <li
                key={r.id}
                className={cn(
                  "surface flex flex-wrap items-center gap-3 px-3 py-3",
                  due && "border-[var(--color-warn)] bg-[var(--color-warn-soft)]/40",
                )}
                data-interactive
              >
                <label className="flex cursor-pointer items-center gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={r.completed}
                    disabled={busyId === r.id}
                    onChange={(e) => void toggle(r.id, e.target.checked)}
                    aria-label={r.completed ? "Mark incomplete" : "Mark complete"}
                  />
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        r.completed && "line-through opacity-60",
                      )}
                    >
                      {r.message}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--color-ink-muted)]">
                      Due {new Date(r.dueDate).toLocaleDateString()}
                      {overdue ? " · overdue" : due ? " · due soon" : ""}
                      {app ? (
                        <>
                          {" · "}
                          <Link
                            to="/applications/$id"
                            params={{ id: app.id }}
                            className="link-soft text-[var(--color-accent)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {app.company}
                          </Link>
                          {" — "}
                          {app.roleTitle}
                        </>
                      ) : (
                        " · application missing"
                      )}
                    </p>
                  </div>
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void onDelete(r.id)}
                >
                  Delete
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
