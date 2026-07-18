import { Link } from "@tanstack/react-router";
import { ApplicationDetail } from "@/components/ApplicationDetail";

export function ApplicationPage({ id }: { id: string }) {
  return (
    <div className="space-y-4">
      <Link to="/" className="link-soft enter-slide-right text-sm text-[var(--color-accent)]">
        ← Back to board
      </Link>
      <ApplicationDetail applicationId={id} />
    </div>
  );
}
