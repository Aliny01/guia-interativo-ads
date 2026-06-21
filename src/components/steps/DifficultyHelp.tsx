"use client";

import { useState } from "react";
import type { DifficultyOption } from "@/lib/steps/stepsConfig";
import { cn } from "@/lib/utils";

export function DifficultyHelp({ options }: { options: DifficultyOption[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mt-4 space-y-2 rounded-xl border border-surface-border bg-bg/60 p-3">
      <p className="px-1 text-xs font-bold uppercase tracking-wide text-ink-muted">
        Qual foi o problema?
      </p>
      {options.map((option, i) => (
        <div key={i}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={cn(
              "w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink transition",
              openIndex === i ? "bg-royal/15" : "bg-surface hover:bg-royal/10"
            )}
          >
            {option.problem}
          </button>
          {openIndex === i && (
            <p className="mt-1 rounded-lg bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink-muted">
              {option.solution}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
