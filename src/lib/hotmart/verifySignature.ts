import type { HotmartWebhookPayload } from "./types";

/**
 * A Hotmart envia um token estático ("hottok") configurado no painel
 * em Ferramentas > Webhook. Ele pode vir no corpo do payload ou no
 * header X-Hotmart-Hottok, dependendo da versão da integração.
 */
export function isValidHotmartToken(
  payload: HotmartWebhookPayload,
  headerToken: string | null
): boolean {
  const expected = process.env.HOTMART_WEBHOOK_TOKEN;
  if (!expected) return false;

  const receivedToken = payload.hottok || headerToken;
  return receivedToken === expected;
}

/** Gera uma senha temporária segura para o primeiro acesso do cliente. */
export function generateTemporaryPassword(): string {
  const chars =
    "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "";
  const randomValues = new Uint32Array(12);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < 12; i++) {
    password += chars[randomValues[i] % chars.length];
  }
  return password;
}
