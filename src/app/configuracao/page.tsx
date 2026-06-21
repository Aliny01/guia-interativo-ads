"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { StepCard } from "@/components/steps/StepCard";
import { StepNavControls } from "@/components/steps/StepNavControls";
import { JourneySidebar } from "@/components/steps/JourneySidebar";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { getSetupSteps, type GuideStep } from "@/lib/steps/stepsConfig";
import type { OnboardingResponses } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default function ConfiguracaoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [steps, setSteps] = useState<GuideStep[]>([]);
  const [completedKeys, setCompletedKeys] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;
      setUserId(userData.user.id);

      const { data: answers } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle<OnboardingResponses>();

      setSteps(getSetupSteps(answers ?? null));

      const { data: progress } = await supabase
        .from("user_progress")
        .select("step_key, status")
        .eq("user_id", userData.user.id)
        .eq("module", "setup")
        .eq("status", "completed");

      setCompletedKeys(new Set((progress ?? []).map((p) => p.step_key)));
      setLoaded(true);
    }
    load();
  }, [supabase]);

  async function handleCompleteStep(stepKey: string) {
    if (!userId) return;

    await supabase.from("user_progress").upsert({
      user_id: userId,
      module: "setup",
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

    await supabase.from("user_progress").delete().eq("user_id", userId).eq("module", "setup");

    setCompletedKeys(new Set());
  }

  const allCompleted = loaded && steps.length > 0 && completedKeys.size === steps.length;
  const noStepsNeeded = loaded && steps.length === 0;
  const currentIndex = (() => {
    const idx = steps.findIndex((s) => !completedKeys.has(s.key));
    return idx === -1 ? Math.max(steps.length - 1, 0) : idx;
  })();
  const currentStep = steps[currentIndex];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 lg:flex-row">
      <JourneySidebar />

      <main className="flex min-h-screen w-full max-w-[680px] flex-1 flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-tight text-ink">Configuração inicial</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            Só estamos mostrando o que ainda falta no seu caso.
          </p>
        </div>

        {loaded && steps.length > 0 && (
          <div className="mb-6">
            <ProgressBar value={completedKeys.size} total={steps.length} />
          </div>
        )}

        <StepNavControls
          canGoBack={completedKeys.size > 0}
          onGoBack={handleGoBackStep}
          onRestart={handleRestart}
        />

        {noStepsNeeded && (
          <div className="mb-6 rounded-card border border-success/30 bg-success/10 p-5 text-center">
            <p className="text-2xl">🎉</p>
            <p className="mt-2 text-sm font-medium leading-relaxed text-success">
              Você já tem tudo configurado! Pode seguir direto para criar sua campanha.
            </p>
          </div>
        )}

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

        {(allCompleted || noStepsNeeded) && (
          <div className="mt-8">
            {allCompleted && (
              <div className="mb-4 rounded-card border border-success/30 bg-success/10 p-4 text-center text-sm font-semibold text-success">
                🎉 Configuração completa! Agora vamos para a parte boa.
              </div>
            )}
            <Button fullWidth onClick={() => router.push("/modulos")}>
              Continuar para os módulos →
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
