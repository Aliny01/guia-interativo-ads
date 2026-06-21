"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("E-mail ou senha incorretos. Verifique e tente novamente.");
      return;
    }

    const redirectTo = searchParams.get("redirect") || "/onboarding";
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">E-mail</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          className="w-full rounded-xl border border-surface-border bg-surface px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 outline-none focus:border-royal-bright focus:ring-2 focus:ring-royal/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Senha</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-surface-border bg-surface px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 outline-none focus:border-royal-bright focus:ring-2 focus:ring-royal/20"
        />
      </div>

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      <Link
        href="/esqueci-senha"
        className="block text-center text-sm font-medium text-royal-bright hover:underline"
      >
        Esqueci minha senha
      </Link>
    </form>
  );
}
