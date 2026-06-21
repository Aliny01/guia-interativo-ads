"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/redefinir-senha`,
    });

    setLoading(false);

    if (resetError) {
      setError("Não foi possível enviar o e-mail. Verifique o endereço informado.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm rounded-card border border-success/30 bg-success/10 p-5 text-center">
        <p className="text-2xl">✅</p>
        <p className="mt-2 text-sm font-medium leading-relaxed text-success">
          Enviamos um link de recuperação para <strong>{email}</strong>. Confira sua caixa de
          entrada (e o spam).
        </p>
      </div>
    );
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

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}

      <Button type="submit" fullWidth disabled={loading}>
        {loading ? "Enviando..." : "Enviar link de recuperação"}
      </Button>
    </form>
  );
}
