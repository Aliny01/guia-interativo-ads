"use client";

import { cn } from "@/lib/utils";

export function ProfileOption({
  icon,
  title,
  description,
  selected,
  onClick,
}: {
  icon: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 rounded-card border-2 p-5 text-left transition active:scale-[0.98]",
        selected
          ? "border-royal-bright bg-royal/15 shadow-glow"
          : "border-surface-border bg-surface hover:border-royal/40"
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-royal/15 text-2xl">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-ink">{title}</h3>
        <p className="mt-0.5 text-sm leading-relaxed text-ink-muted">{description}</p>
      </div>
    </button>
  );
}
