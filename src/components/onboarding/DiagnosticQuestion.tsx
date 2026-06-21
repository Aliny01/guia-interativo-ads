"use client";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export function DiagnosticQuestion({
  question,
  value,
  onAnswer,
}: {
  question: string;
  value: boolean | null;
  onAnswer: (value: boolean) => void;
}) {
  return (
    <Card>
      <p className="text-base font-semibold leading-relaxed text-ink">{question}</p>
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => onAnswer(true)}
          className={cn(
            "flex-1 rounded-xl border-2 py-3.5 text-sm font-bold transition",
            value === true
              ? "border-royal-bright bg-gradient-to-b from-royal-bright to-royal text-white shadow-glow"
              : "border-surface-border bg-bg/60 text-ink hover:border-royal/40"
          )}
        >
          Sim
        </button>
        <button
          onClick={() => onAnswer(false)}
          className={cn(
            "flex-1 rounded-xl border-2 py-3.5 text-sm font-bold transition",
            value === false
              ? "border-royal-bright bg-gradient-to-b from-royal-bright to-royal text-white shadow-glow"
              : "border-surface-border bg-bg/60 text-ink hover:border-royal/40"
          )}
        >
          Não
        </button>
      </div>
    </Card>
  );
}
