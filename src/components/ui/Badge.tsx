import { cn } from "@/lib/utils";

export function Badge({
  children,
  variant = "info",
}: {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        variant === "info" && "bg-royal/15 text-royal-bright",
        variant === "success" && "border border-success/30 bg-success/10 text-success",
        variant === "warning" && "border border-amber-400/30 bg-amber-400/10 text-amber-400"
      )}
    >
      {children}
    </span>
  );
}
