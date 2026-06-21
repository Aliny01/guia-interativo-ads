"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DiagnosticQuestion } from "@/components/onboarding/DiagnosticQuestion";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { JourneySidebar } from "@/components/steps/JourneySidebar";
import { diagnosticoQuestions } from "@/lib/steps/stepsConfig";

export const dynamic = "force-dynamic";

type Answers = Record<string, boolean | null>;

export default function DiagnosticoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAnswers() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from("onboarding_responses")
        .select("*")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (data) {
        setAnswers({
          has_facebook_profile: data.has_facebook_profile,
          has_facebook_page: data.has_facebook_page,
          has_business_manager: data.has_business_manager,
          instagram_is_business: data.instagram_is_business,
        });
      }
    }
    loadAnswers();
  }, [supabase]);

  const answeredCount = diagnosticoQuestions.filter(
    (q) => answers[q.key] !== undefined && answers[q.key] !== null
  ).length;
  const allAnswered = answeredCount === diagnosticoQuestions.length;

  async function handleContinue() {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();

    if (userData.user) {
      await supabase.from("onboarding_responses").upsert({
        user_id: userData.user.id,
        has_facebook_profile: answers.has_facebook_profile ?? null,
        has_facebook_page: answers.has_facebook_page ?? null,
        has_business_manager: answers.has_business_manager ?? null,
        instagram_is_business: answers.instagram_is_business ?? null,
        completed_at: new Date().toISOString(),
      });
    }

    router.push("/configuracao");
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 lg:flex-row">
      <JourneySidebar />

      <main className="flex min-h-screen w-full max-w-[680px] flex-1 flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-tight text-ink">
            Vamos entender seu ponto de partida
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            Responda com sinceridade — isso define quais passos vamos te mostrar.
          </p>
        </div>

        <div className="mb-6">
          <ProgressBar value={answeredCount} total={diagnosticoQuestions.length} />
        </div>

        <div className="flex-1 space-y-3">
          {diagnosticoQuestions.map((q) => (
            <DiagnosticQuestion
              key={q.key}
              question={q.question}
              value={answers[q.key] ?? null}
              onAnswer={(value) => setAnswers((prev) => ({ ...prev, [q.key]: value }))}
            />
          ))}
        </div>

        <Button
          className="mt-8"
          fullWidth
          disabled={!allAnswered || loading}
          onClick={handleContinue}
        >
          {loading ? "Salvando..." : "Ver meus passos"}
        </Button>
      </main>
    </div>
  );
}
