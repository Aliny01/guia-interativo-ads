"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ProfileOption } from "@/components/onboarding/ProfileOption";
import { Button } from "@/components/ui/Button";
import { profileOptions } from "@/lib/steps/stepsConfig";
import type { ProfileType } from "@/types/database.types";

export const dynamic = "force-dynamic";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [selected, setSelected] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    async function loadProfile() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("profile_type, full_name")
        .eq("id", userData.user.id)
        .single();

      if (profile?.profile_type) setSelected(profile.profile_type);
      if (profile?.full_name) setName(profile.full_name.split(" ")[0]);
    }
    loadProfile();
  }, [supabase]);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      await supabase
        .from("profiles")
        .update({ profile_type: selected })
        .eq("id", userData.user.id);
    }

    router.push("/diagnostico");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-[680px] flex-col px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-wide text-royal-bright">
          {name ? `Olá, ${name} 👋` : "Bem-vindo(a) 👋"}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight text-ink">
          Qual é a sua situação hoje?
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Vamos personalizar o guia de acordo com o seu ponto de partida.
        </p>
      </div>

      <div className="flex-1 space-y-3">
        {profileOptions.map((option) => (
          <ProfileOption
            key={option.key}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={selected === option.key}
            onClick={() => setSelected(option.key)}
          />
        ))}
      </div>

      <Button className="mt-8" fullWidth disabled={!selected || loading} onClick={handleContinue}>
        {loading ? "Carregando..." : "Continuar"}
      </Button>
    </main>
  );
}
