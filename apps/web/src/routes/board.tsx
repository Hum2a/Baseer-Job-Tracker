import { useState } from "react";
import {
  applicationStatuses,
  type ApplicationStatus,
} from "@docket/shared";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApplications } from "@/hooks/useApplications";
import { useReminders } from "@/hooks/useReminders";

const emptyForm = {
  company: "",
  roleTitle: "",
  industry: "",
  location: "",
  jobUrl: "",
  status: "wishlist" as ApplicationStatus,
  appliedDate: "",
  salaryRange: "",
  source: "",
};

const selectClass =
  "w-full rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm transition-[border-color,box-shadow,transform] duration-[var(--duration)] ease-[var(--ease-out-soft)] hover:border-[color-mix(in_srgb,var(--color-accent)_35%,var(--color-line))] focus:border-[var(--color-accent)] focus:outline-none focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_22%,transparent)]";

export function BoardPage() {
  const { applications, loading, error, create, update, remove } = useApplications();
  const { reminders } = useReminders();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const onStatusChange = async (id: string, status: ApplicationStatus) => {
    await update(id, { status });
  };

  const setField = <K extends keyof typeof emptyForm>(key: K, value: (typeof emptyForm)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await create({
        company: form.company.trim(),
        roleTitle: form.roleTitle.trim(),
        industry: form.industry.trim(),
        location: form.location.trim() || null,
        jobUrl: form.jobUrl.trim() || null,
        status: form.status,
        appliedDate: form.appliedDate || null,
        salaryRange: form.salaryRange.trim() || null,
        source: form.source.trim() || null,
      });
      setForm(emptyForm);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="enter-up flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl">Kanban</h2>
        <Button
          onClick={() => {
            setOpen((v) => !v);
            if (open) setForm(emptyForm);
          }}
        >
          {open ? "Cancel" : "Add application"}
        </Button>
      </div>
      {open ? (
        <form
          onSubmit={(e) => void onCreate(e)}
          className="surface enter-scale grid gap-3 p-4 md:grid-cols-2"
        >
          <p className="md:col-span-2 text-sm text-[var(--color-ink-muted)]">
            Fill in as much as you can — these details go into Docket and the
            notification email.
          </p>

          <label className="space-y-1 text-sm">
            <span>Company *</span>
            <Input
              placeholder="e.g. Charlotte Tilbury Beauty"
              value={form.company}
              onChange={(e) => setField("company", e.target.value)}
              required
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Position / role *</span>
            <Input
              placeholder="e.g. Brand Manager"
              value={form.roleTitle}
              onChange={(e) => setField("roleTitle", e.target.value)}
              required
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Industry *</span>
            <Input
              placeholder="e.g. Beauty, Fintech"
              value={form.industry}
              onChange={(e) => setField("industry", e.target.value)}
              required
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Location</span>
            <Input
              placeholder="e.g. London, Remote, Hybrid"
              value={form.location}
              onChange={(e) => setField("location", e.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm md:col-span-2">
            <span>Job URL</span>
            <Input
              type="url"
              placeholder="https://…"
              value={form.jobUrl}
              onChange={(e) => setField("jobUrl", e.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Status</span>
            <select
              className={selectClass}
              value={form.status}
              onChange={(e) => setField("status", e.target.value as ApplicationStatus)}
            >
              {applicationStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1 text-sm">
            <span>Applied date</span>
            <Input
              type="date"
              value={form.appliedDate}
              onChange={(e) => setField("appliedDate", e.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Salary range</span>
            <Input
              placeholder="e.g. GBP 35k–45k"
              value={form.salaryRange}
              onChange={(e) => setField("salaryRange", e.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            <span>Source</span>
            <Input
              placeholder="e.g. LinkedIn, Referral, Agency"
              value={form.source}
              onChange={(e) => setField("source", e.target.value)}
            />
          </label>

          <div className="md:col-span-2 flex flex-wrap gap-2 pt-1">
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create application"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setForm(emptyForm);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
      {error ? <p className="text-sm text-[var(--color-danger)]">{error}</p> : null}
      {loading ? (
        <p className="text-sm text-[var(--color-ink-muted)]">Loading board…</p>
      ) : (
        <KanbanBoard
          applications={applications}
          reminders={reminders}
          onStatusChange={onStatusChange}
          onDelete={remove}
        />
      )}
    </div>
  );
}
