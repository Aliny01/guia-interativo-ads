import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function EsqueciSenhaPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-bg to-surface px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-royal-bright to-royal text-2xl shadow-glow">
          🔑
        </div>
        <h1 className="text-3xl font-bold leading-tight text-ink">Recuperar senha</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Informe seu e-mail para receber o link de redefinição
        </p>
      </div>

      <ForgotPasswordForm />

      <Link
        href="/login"
        className="mt-6 text-sm font-medium text-royal-bright hover:underline"
      >
        ← Voltar para o login
      </Link>
    </main>
  );
}
