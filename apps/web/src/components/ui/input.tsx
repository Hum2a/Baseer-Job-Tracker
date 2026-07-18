import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-md border border-[var(--color-line)] bg-white px-3 py-2 text-sm text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]",
        "transition-[border-color,box-shadow,background-color,transform] duration-[var(--duration)] ease-[var(--ease-out-soft)]",
        "hover:border-[color-mix(in_srgb,var(--color-accent)_35%,var(--color-line))]",
        "focus:border-[var(--color-accent)] focus:outline-none focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-accent)_22%,transparent)]",
        "active:scale-[0.995]",
        className,
      )}
      {...props}
    />
  );
}
