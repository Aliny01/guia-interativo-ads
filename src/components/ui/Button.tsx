import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary" &&
          "bg-gradient-to-b from-royal-bright to-royal text-white shadow-glow hover:shadow-glow-lg hover:from-royal-bright hover:to-royal-bright",
        variant === "secondary" &&
          "border border-surface-border bg-surface text-ink hover:border-royal/50 hover:bg-surface/80",
        variant === "ghost" && "bg-transparent text-royal-bright hover:bg-royal/10",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
