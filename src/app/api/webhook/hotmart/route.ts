import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient } from "@/lib/email/resend";
import { welcomeEmailHtml, welcomeEmailText } from "@/lib/email/templates";
import { isValidHotmartToken, generateTemporaryPassword } from "@/lib/hotmart/verifySignature";
import { APPROVED_EVENTS, type HotmartWebhookPayload } from "@/lib/hotmart/types";

export async function POST(request: NextRequest) {
  console.log("[webhook] recebido");

  let payload: HotmartWebhookPayload;
  try {
    payload = (await request.json()) as HotmartWebhookPayload;
    console.log("[webhook] evento:", payload.event, "| email:", payload.data.buyer?.email);
  } catch (e) {
    console.error("[webhook] falha ao parsear JSON:", e);
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const headerToken = request.headers.get("x-hotmart-hottok");
  const tokenEnvSet = !!process.env.HOTMART_WEBHOOK_TOKEN;
  console.log("[webhook] HOTMART_WEBHOOK_TOKEN definido:", tokenEnvSet);

  if (!isValidHotmartToken(payload, headerToken)) {
    console.error("[webhook] token inválido. Header:", headerToken, "| Payload hottok:", payload.hottok);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  if (!APPROVED_EVENTS.includes(payload.event)) {
    console.log("[webhook] evento ignorado:", payload.event);
    return NextResponse.json({ received: true, ignored: payload.event });
  }

  const email = payload.data.buyer?.email;
  const name = payload.data.buyer?.name ?? "";
  const transactionId = payload.data.purchase?.transaction ?? null;
  const productId = payload.data.product?.id ? String(payload.data.product.id) : null;

  if (!email) {
    console.error("[webhook] e-mail do comprador ausente no payload");
    return NextResponse.json({ error: "E-mail do comprador não informado" }, { status: 400 });
  }

  const supabaseUrlSet = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKeySet = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log("[webhook] SUPABASE_URL definida:", supabaseUrlSet, "| SERVICE_ROLE_KEY definida:", supabaseKeySet);

  const supabase = createAdminClient();
  const temporaryPassword = generateTemporaryPassword();

  // Evita duplicar usuário em reenvios do mesmo evento pela Hotmart.
  console.log("[webhook] buscando usuários existentes...");
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error("[webhook] erro ao listar usuários:", listError.message);
    return NextResponse.json({ error: listError.message }, { status: 500 });
  }

  const existing = existingUsers.users.find((u) => u.email === email);
  let userId: string;

  if (existing) {
    console.log("[webhook] usuário já existe, id:", existing.id);
    userId = existing.id;
  } else {
    console.log("[webhook] criando novo usuário para:", email);
    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: { full_name: name },
    });

    if (createError || !created.user) {
      console.error("[webhook] erro ao criar usuário:", createError?.message);
      return NextResponse.json(
        { error: createError?.message ?? "Falha ao criar usuário" },
        { status: 500 }
      );
    }

    console.log("[webhook] usuário criado, id:", created.user.id);
    userId = created.user.id;
  }

  console.log("[webhook] salvando perfil...");
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    email,
    full_name: name,
    hotmart_transaction_id: transactionId,
    hotmart_product_id: productId,
  });

  if (profileError) {
    console.error("[webhook] erro ao salvar perfil:", profileError.message);
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // Para usuários já existentes (reenvio de webhook) não reenviamos senha nova por e-mail.
  if (!existing) {
    console.log("[webhook] enviando e-mail de boas-vindas para:", email);
    const resend = getResendClient();
    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login`;
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      replyTo: process.env.EMAIL_FROM!,
      subject: "Seu acesso ao Guia Interativo de Anúncios no Instagram",
      html: welcomeEmailHtml({ name, email, password: temporaryPassword, loginUrl }),
      text: welcomeEmailText({ name, email, password: temporaryPassword, loginUrl }),
    });
    console.log("[webhook] e-mail enviado com sucesso");
  }

  console.log("[webhook] concluído com sucesso");
  return NextResponse.json({ received: true });
}
