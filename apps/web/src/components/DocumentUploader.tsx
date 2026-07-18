import { useState } from "react";
import type { Document, DocumentType } from "@docket/shared";
import { Button } from "./ui/button";

type Props = {
  documents: Document[];
  loading?: boolean;
  applicationId?: string | null;
  onUpload: (type: DocumentType, file: File) => Promise<void>;
  onDownload: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function DocumentUploader({
  documents,
  loading,
  applicationId,
  onUpload,
  onDownload,
  onDelete,
}: Props) {
  const [type, setType] = useState<DocumentType>("resume");
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      await onUpload(type, file);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="enter-up delay-2 space-y-4">
      <h2 className="font-display text-xl">Documents</h2>
      <div className="surface flex flex-wrap items-center gap-2 p-4">
        <select
          className="rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm transition-[border-color,box-shadow,transform] duration-[var(--duration)] ease-[var(--ease-out-soft)] hover:border-[color-mix(in_srgb,var(--color-accent)_35%,var(--color-line))] focus:border-[var(--color-accent)] focus:outline-none"
          value={type}
          onChange={(e) => setType(e.target.value as DocumentType)}
        >
          <option value="resume">Resume</option>
          <option value="cover_letter">Cover letter</option>
        </select>
        <label
          className="inline-flex cursor-pointer items-center rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm transition-[background-color,transform,border-color] duration-[var(--duration)] ease-[var(--ease-out-soft)] hover:-translate-y-px hover:border-[color-mix(in_srgb,var(--color-accent)_30%,var(--color-line))] hover:bg-[var(--color-surface)] active:scale-[0.97]"
          data-interactive
        >
          {busy ? "Uploading…" : "Upload file"}
          <input
            type="file"
            className="hidden"
            disabled={busy}
            onChange={(e) => void onFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <span className="text-xs text-[var(--color-ink-muted)]">
          {applicationId ? "Attached to this application" : "General templates"}
        </span>
      </div>
      {loading ? (
        <p className="text-sm text-[var(--color-ink-muted)]">Loading documents…</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-muted)]">No documents uploaded.</p>
      ) : (
        <ul className="stagger-fast space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="surface flex items-center justify-between gap-3 px-3 py-2"
              data-interactive
            >
              <div>
                <p className="text-sm font-medium">{doc.filename}</p>
                <p className="text-xs capitalize text-[var(--color-ink-muted)]">
                  {doc.type.replace("_", " ")} ·{" "}
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-1">
                <Button type="button" variant="secondary" size="sm" onClick={() => void onDownload(doc.id)}>
                  Download
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => void onDelete(doc.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
