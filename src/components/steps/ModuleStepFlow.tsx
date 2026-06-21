"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { StepCard } from "@/components/steps/StepCard";
import { StepNavControls } from "@/components/steps/StepNavControls";
import { JourneySidebar } from "@/components/steps/JourneySidebar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getModuleSteps } from "@/lib/steps/stepsConfig";
import type { ModuleKey } from "@/types/database.types";

export function ModuleStepFlow({
  moduleKey,
  title,
  subtitle,
  successMessage,
}: {
  moduleKey: Exclude<ModuleKey, "setup">;
  title: string;
  subtitle: string;
  successMessage: string;
}) {
  const supabase = createClient();
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const steps = getModuleSteps(moduleKey);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setUserId(userData.user.id);

      await supabase
        .from("profiles")
        .update({ current_module: moduleKey })
        .eq("id", userData.user.id);

      const { data: progress } = await supabase
        .from("user_progress")
        .select("step_key, status")
        .eq("user_id", userData.user.id)
        .eq("module", moduleKey)
        .eq("status", "completed");

      setCompletedKeys(new Set((progress ?? []).map((p) => p.step_key)));
      setLoaded(true);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCompleteStep(stepKey: string) {
    if (!userId) return;

    await supabase.from("user_progress").upsert({
      user_id: userId,
      module: moduleKey,
      step_key: stepKey,
      status: "completed",
      completed_at: new Date().toISOString(),
    });

    setCompletedKeys((prev) => new Set(prev).add(stepKey));
  }

  async function handleGoBackStep() {
    if (!userId) return;

    const lastCompleted = [...steps].reverse().find((s) => completedKeys.has(s.key));
    if (!lastCompleted) return;

    await supabase
      .from("user_progress")
      .delete()
      .eq("user_id", userId)
      .eq("step_key", lastCompleted.key);

    setCompletedKeys((prev) => {
      const next = new Set(prev);
      next.delete(lastCompleted.key);
      return next;
    });
  }

  async function handleRestart() {
    if (!userId) return;

    await supabase.from("user_progress").delete().eq("user_id", userId).eq("module", moduleKey);

    setCompletedKeys(new Set());
  }

  const allCompleted = loaded && completedKeys.size === steps.length;
  const currentIndex = (() => {
    const idx = steps.findIndex((s) => !completedKeys.has(s.key));
    return idx === -1 ? Math.max(steps.length - 1, 0) : idx;
  })();
  const currentStep = steps[currentIndex];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 lg:flex-row">
      <JourneySidebar />

      <main className="flex min-h-screen w-full max-w-[680px] flex-1 flex-col">
        <Link
          href="/modulos"
          className="mb-4 inline-block text-sm font-medium text-royal-bright hover:underline"
        >
          ← Voltar para os módulos
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{subtitle}</p>
        </div>

        <div className="mb-6">
          <ProgressBar value={completedKeys.size} total={steps.length} />
        </div>

        <StepNavControls
          canGoBack={completedKeys.size > 0}
          onGoBack={handleGoBackStep}
          onRestart={handleRestart}
        />

        <div className="flex-1">
          {currentStep && (
            <StepCard
              key={currentStep.key}
              step={currentStep}
              index={currentIndex}
              completed={completedKeys.has(currentStep.key)}
              onComplete={() => handleCompleteStep(currentStep.key)}
            />
          )}
        </div>

        {allCompleted && (
          <div className="mt-8 rounded-card border border-success/30 bg-success/10 p-5 text-center">
            <p className="text-2xl">🚀</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-success">
              {successMessage}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
