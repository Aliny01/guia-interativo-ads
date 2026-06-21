"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Não foi possível atualizar a senha. O link pode ter expirado.");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">Nova senha</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-surface-border bg-surface px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 outline-none focus:border-royal-bright focus:ring-2 focus:ring-royal/20"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-ink">
          Confirmar nova senha
        </label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full rounded-xl border border-surface-border bg-surface px-4 py-3.5 text-sm text-ink placeholder:text-ink-muted/60 outline-none focus:border-royal-bright focus:ring-2 focus:ring-royal/20"
        />
      </div>

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </form>
  );
}
