"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getModuleSteps, getSetupSteps } from "@/lib/steps/stepsConfig";
import { cn } from "@/lib/utils";
import type { OnboardingResponses, Profile } from "@/types/database.types";

type StageStatus = "done" | "current" | "pending";

type JourneyItem = {
  key: string;
  label: string;
  status: StageStatus;
};

export function JourneySidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [items, setItems] = useState<JourneyItem[] | null>(null);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const [{ data: profile }, { data: answers }, { data: progressRows }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userData.user.id).maybeSingle<Profile>(),
        supabase
          .from("onboarding_responses")
          .select("*")
          .eq("user_id", userData.user.id)
          .maybeSingle<OnboardingResponses>(),
        supabase
          .from("user_progress")
          .select("module, step_key, status")
          .eq("user_id", userData.user.id)
          .eq("status", "completed"),
      ]);

      const completedKeys = new Set((progressRows ?? []).map((p) => p.step_key));
      const setupSteps = getSetupSteps(answers ?? null);
      const diagnosticoDone = !!answers?.completed_at;
      const setupDone = setupSteps.length === 0 || setupSteps.every((s) => completedKeys.has(s.key));
      const moduleChosen = profile?.current_module ?? null;

      const built: JourneyItem[] = [
        {
          key: "diagnostico",
          label: "Diagnóstico",
          status: diagnosticoDone ? "done" : "current",
        },
        {
          key: "configuracao",
          label: "Configuração inicial",
          status: !diagnosticoDone ? "pending" : setupDone ? "done" : "current",
        },
        {
          key: "modulos",
          label: "Escolha da campanha",
          status: !setupDone ? "pending" : moduleChosen ? "done" : "current",
        },
      ];

      if (moduleChosen) {
        const moduleSteps = getModuleSteps(moduleChosen);
        const moduleLabel =
          moduleChosen === "mensagens" ? "Campanha de Mensagens" : "Campanha de Seguidores";

        let foundCurrent = false;
        moduleSteps.forEach((step) => {
          const done = completedKeys.has(step.key);
          let status: StageStatus = done ? "done" : "pending";
          if (!done && !foundCurrent) {
            status = "current";
            foundCurrent = true;
          }
          built.push({ key: step.key, label: step.title, status });
        });

        const allModuleDone = moduleSteps.every((s) => completedKeys.has(s.key));
        built.push({
          key: "publicado",
          label: `${moduleLabel} publicada 🎉`,
          status: allModuleDone ? "done" : "pending",
        });
      }

      setItems(built);
    }
    load();
  }, [supabase, pathname]);

  if (!items) return null;

  const doneCount = items.filter((i) => i.status === "done").length;
  const current = items.find((i) => i.status === "current");
  const percent = Math.round((doneCount / items.length) * 100);

  return (
    <>
      {/* Mobile: header compacto com progresso geral */}
      <div className="mb-6 w-full lg:hidden">
        <div className="rounded-card border border-surface-border bg-surface px-4 py-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink-muted">
            <span>{current ? current.label : "Jornada concluída 🎉"}</span>
            <span className="text-royal-bright">{percent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-bg">
            <div
              className="h-full rounded-full bg-gradient-to-r from-royal to-royal-bright shadow-[0_0_10px_rgba(37,99,235,0.7)] transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Desktop: menu lateral completo */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-10 rounded-card border border-surface-border bg-bg p-5">
          <p className="mb-4 text-xs font-bold uppercase tracking-wide text-royal-bright">
            Sua jornada
          </p>
          <ol className="space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    item.status === "done" && "bg-success text-white",
                    item.status === "current" &&
                      "bg-royal-bright text-white shadow-[0_0_8px_rgba(37,99,235,0.8)]",
                    item.status === "pending" && "border-2 border-surface-border text-transparent"
                  )}
                >
                  {item.status === "done" ? "✓" : ""}
                </span>
                <span
                  className={cn(
                    "text-sm leading-snug",
                    item.status === "current" && "font-bold text-ink",
                    item.status === "done" && "text-ink-muted line-through",
                    item.status === "pending" && "text-ink-muted/60"
                  )}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </>
  );
}
