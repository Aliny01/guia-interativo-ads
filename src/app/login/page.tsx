import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-bg to-surface px-4 py-12">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-royal-bright to-royal text-2xl shadow-glow">
          📱
        </div>
        <h1 className="text-3xl font-bold leading-tight text-ink">Guia Interativo Instagram</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Entre com os dados recebidos por e-mail
        </p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
