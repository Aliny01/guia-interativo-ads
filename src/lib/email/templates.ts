export function welcomeEmailHtml({
  name,
  email,
  password,
  loginUrl,
}: {
  name: string;
  email: string;
  password: string;
  loginUrl: string;
}) {
  return `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1c1f26;">
    <div style="background: linear-gradient(150deg, #1a56db, #123a99); padding: 32px 28px; border-radius: 12px 12px 0 0;">
      <p style="color: #ffffff; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; opacity: 0.85; margin: 0 0 8px;">Acesso liberado</p>
      <h1 style="color: #ffffff; font-size: 22px; margin: 0;">Bem-vindo(a) ao Guia Interativo de Anúncios no Instagram</h1>
    </div>
    <div style="border: 1px solid #d9e3f7; border-top: none; padding: 28px; border-radius: 0 0 12px 12px;">
      <p>Olá, ${name || "tudo bem"}!</p>
      <p>Sua compra foi aprovada e seu acesso já está liberado. Use os dados abaixo para entrar na plataforma:</p>
      <div style="background: #eaf1fd; border-radius: 8px; padding: 16px 20px; margin: 20px 0;">
        <p style="margin: 0 0 6px;"><strong>E-mail:</strong> ${email}</p>
        <p style="margin: 0;"><strong>Senha temporária:</strong> ${password}</p>
      </div>
      <p>Por segurança, recomendamos trocar a senha no seu primeiro acesso.</p>
      <a href="${loginUrl}" style="display: inline-block; background: #1a56db; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 12px;">Acessar a plataforma</a>
      <p style="margin-top: 24px; font-size: 13px; color: #5b6472;">Se você não fez essa compra, ignore este e-mail.</p>
    </div>
  </div>
  `;
}
