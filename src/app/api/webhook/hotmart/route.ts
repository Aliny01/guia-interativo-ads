import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/email/resend";
import { welcomeEmailHtml } from "@/lib/email/templates";
import { isValidHotmartToken, generateTemporaryPassword } from "@/lib/hotmart/verifySignature";
import { APPROVED_EVENTS, type HotmartWebhookPayload } from "@/lib/hotmart/types";

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as HotmartWebhookPayload;
  const headerToken = request.headers.get("x-hotmart-hottok");

  if (!isValidHotmartToken(payload, headerToken)) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  if (!APPROVED_EVENTS.includes(payload.event)) {
    // Eventos como reembolso/cancelamento não criam acesso. Retorna 200 para a Hotmart não reenviar.
    return NextResponse.json({ received: true, ignored: payload.event });
  }

  const email = payload.data.buyer?.email;
  const name = payload.data.buyer?.name ?? "";
  const transactionId = payload.data.purchase?.transaction ?? null;
  const productId = payload.data.product?.id ? String(payload.data.product.id) : null;

  if (!email) {
    return NextResponse.json({ error: "E-mail do comprador não informado" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const temporaryPassword = generateTemporaryPassword();

  // Evita duplicar usuário em reenvios do mesmo evento pela Hotmart.
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existing = existingUsers.users.find((u) => u.email === email);

  let userId: string;

  if (existing) {
    userId = existing.id;
  } else {
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    if (createError || !created.user) {
      return NextResponse.json(
        { error: createError?.message ?? "Falha ao criar usuário" },
        { status: 500 }
      );
    }

    userId = created.user.id;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    email,
    full_name: name,
    hotmart_transaction_id: transactionId,
    hotmart_product_id: productId,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Para usuários já existentes (reenvio de webhook) não reenviamos senha nova por e-mail.
  if (!existing) {
    const resend = getResendClient();
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Seu acesso ao Guia Interativo de Anúncios no Instagram",
      html: welcomeEmailHtml({
        name,
        email,
        password: temporaryPassword,
        loginUrl: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
      }),
    });
  }

  return NextResponse.json({ received: true });
}
