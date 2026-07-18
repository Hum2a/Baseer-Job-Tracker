import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)] disabled:pointer-events-none disabled:opacity-50",
        "transition-[color,background-color,border-color,box-shadow,transform,filter,opacity] duration-[var(--duration)] ease-[var(--ease-out-soft)]",
        "hover:-translate-y-px active:translate-y-0 active:scale-[0.97]",
        size === "sm" ? "px-2.5 py-1.5 text-sm" : "px-3.5 py-2 text-sm",
        variant === "primary" &&
          "bg-[var(--color-accent)] text-white shadow-sm hover:brightness-110 hover:shadow-md",
        variant === "secondary" &&
          "border border-[var(--color-line)] bg-[var(--color-panel)] text-[var(--color-ink)] hover:border-[var(--color-accent)]/30 hover:bg-[var(--color-surface)]",
        variant === "ghost" &&
          "text-[var(--color-ink-muted)] hover:bg-black/5 hover:text-[var(--color-ink)]",
        variant === "danger" &&
          "bg-[var(--color-danger)] text-white shadow-sm hover:brightness-110 hover:shadow-md",
        className,
      )}
      {...props}
    />
  );
}
