"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { GuideStep } from "@/lib/steps/stepsConfig";
import { DifficultyHelp } from "./DifficultyHelp";

export function StepCard({
  step,
  index,
  completed,
  onComplete,
}: {
  step: GuideStep;
  index: number;
  completed: boolean;
  onComplete: () => Promise<void> | void;
}) {
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [justCompleted, setJustCompleted] = useState(false);

  async function handleComplete() {
    setLoading(true);
    await onComplete();
    setLoading(false);
    setJustCompleted(true);
    setTimeout(() => setJustCompleted(false), 650);
  }

  function toggleChecked(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  return (
    <Card
      className={cn(
        "border-l-4",
        completed
          ? "border-l-success bg-success/5"
          : "border-l-royal-bright",
        justCompleted && "animate-step-complete"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-royal/15 text-2xl">
          {step.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-royal-bright">
              Etapa {index + 1}
            </span>
            {completed && <Badge variant="success">✓ Concluída</Badge>}
          </div>
          <h3 className="text-lg font-bold leading-snug text-ink">{step.title}</h3>
          {step.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.description}</p>
          )}
        </div>
      </div>

      <ul className="mt-5 space-y-2.5">
        {step.instructions.map((instruction, i) => {
          const isChecked = checked.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggleChecked(i)}
                aria-pressed={isChecked}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left text-sm leading-relaxed transition",
                  isChecked
                    ? "bg-success/10 text-ink-muted"
                    : "bg-bg/60 text-ink hover:bg-bg"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-[11px] font-bold transition",
                    isChecked
                      ? "scale-100 border-success bg-success text-white"
                      : "border-surface-border bg-transparent"
                  )}
                >
                  {isChecked && <span className="animate-check-pop">✓</span>}
                </span>
                <span className={isChecked ? "line-through" : undefined}>{instruction}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {step.example && (
        <div className="mt-4 rounded-xl border border-dashed border-surface-border bg-bg/60 px-4 py-3 text-sm italic leading-relaxed text-ink-muted">
          💬 {step.example}
        </div>
      )}

      {step.link && (
        <a
          href={step.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-royal/40 bg-royal/10 px-4 py-2.5 text-sm font-semibold text-royal-bright transition hover:bg-royal/20"
        >
          🔗 Acessar: {step.link.label}
        </a>
      )}

      {step.tip && (
        <div className="mt-4 rounded-xl border-l-4 border-royal-bright bg-royal/10 px-4 py-3.5 text-sm leading-relaxed text-ink">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-royal-bright">Dica</p>
          {step.tip}
        </div>
      )}

      {step.warning && (
        <div className="mt-4 rounded-xl border-l-4 border-amber-400 bg-amber-400/10 px-4 py-3.5 text-sm leading-relaxed text-ink">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-amber-400">Atenção</p>
          {step.warning}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={handleComplete} disabled={loading || completed}>
          {completed ? "✓ Feito!" : loading ? "Salvando..." : "Feito! Próximo passo"}
        </Button>

        {step.difficulty && step.difficulty.length > 0 && (
          <Button variant="ghost" onClick={() => setShowHelp((v) => !v)}>
            🤔 Tive dificuldade
          </Button>
        )}
      </div>

      {showHelp && step.difficulty && <DifficultyHelp options={step.difficulty} />}
    </Card>
  );
}
