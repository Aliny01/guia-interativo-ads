"use client";

import { useState } from "react";

export function StepNavControls({
  canGoBack,
  onGoBack,
  onRestart,
}: {
  canGoBack: boolean;
  onGoBack: () => Promise<void> | void;
  onRestart: () => Promise<void> | void;
}) {
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const [loadingAction, setLoadingAction] = useState<"back" | "restart" | null>(null);

  async function handleGoBack() {
    setLoadingAction("back");
    await onGoBack();
    setLoadingAction(null);
  }

  async function handleRestart() {
    if (!confirmingRestart) {
      setConfirmingRestart(true);
      return;
    }
    setLoadingAction("restart");
    await onRestart();
    setLoadingAction(null);
    setConfirmingRestart(false);
  }

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleGoBack}
        disabled={!canGoBack || loadingAction !== null}
        className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface px-4 py-2 text-xs font-semibold text-ink transition hover:border-royal/50 disabled:opacity-40"
      >
        ← {loadingAction === "back" ? "Voltando..." : "Voltar etapa"}
      </button>

      <button
        type="button"
        onClick={handleRestart}
        disabled={!canGoBack || loadingAction !== null}
        className={
          confirmingRestart
            ? "inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-semibold text-amber-400 disabled:opacity-40"
            : "inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface px-4 py-2 text-xs font-semibold text-ink transition hover:border-royal/50 disabled:opacity-40"
        }
      >
        ↺{" "}
        {loadingAction === "restart"
          ? "Reiniciando..."
          : confirmingRestart
            ? "Confirmar reinício?"
            : "Voltar do início"}
      </button>

      {confirmingRestart && loadingAction === null && (
        <button
          type="button"
          onClick={() => setConfirmingRestart(false)}
          className="text-xs font-medium text-ink-muted underline"
        >
          cancelar
        </button>
      )}
    </div>
  );
}
