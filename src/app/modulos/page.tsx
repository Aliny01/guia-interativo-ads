"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ModuleCard } from "@/components/steps/ModuleCard";
import { JourneySidebar } from "@/components/steps/JourneySidebar";

export const dynamic = "force-dynamic";

export default function ModulosPage() {
  const supabase = createClient();
  const [mensagensDone, setMensagensDone] = useState(false);
  const [seguidoresDone, setSeguidoresDone] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data } = await supabase
        .from("user_progress")
        .select("module, status")
        .eq("user_id", userData.user.id)
        .eq("status", "completed");

      const mensagensCount = (data ?? []).filter((p) => p.module === "mensagens").length;
      const seguidoresCount = (data ?? []).filter((p) => p.module === "seguidores").length;

      setMensagensDone(mensagensCount >= 5);
      setSeguidoresDone(seguidoresCount >= 5);
    }
    load();
  }, [supabase]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 lg:flex-row">
      <JourneySidebar />

      <main className="flex min-h-screen w-full max-w-[680px] flex-1 flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold leading-tight text-ink">
            O que você quer fazer agora?
          </h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">
            Escolha o tipo de campanha que você quer criar.
          </p>
        </div>

        <div className="space-y-3">
          <ModuleCard
            href="/modulos/mensagens"
            icon="💬"
            title="Campanha de Mensagens"
            description={
              mensagensDone
                ? "✅ Concluída — acesse para revisar os passos"
                : "Receba clientes direto no seu WhatsApp"
            }
          />
          <ModuleCard
            href="/modulos/seguidores"
            icon="👥"
            title="Campanha de Seguidores"
            description={
              seguidoresDone
                ? "✅ Concluída — acesse para revisar os passos"
                : "Cresça seu perfil com pessoas reais e interessadas"
            }
          />
        </div>
      </main>
    </div>
  );
}
