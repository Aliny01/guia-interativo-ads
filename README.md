# Guia Interativo — Anúncios no Instagram

Plataforma web (produto digital vendido na Hotmart) que guia o cliente passo a passo
para criar seus primeiros anúncios profissionais no Instagram, com base no conteúdo
do ebook "Como Anunciar no Instagram de Forma Profissional".

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (Postgres + Auth)
- Resend (envio de e-mail transacional)

## Fluxo do produto

1. Cliente compra na Hotmart → webhook `POST /api/webhook/hotmart` cria o usuário no
   Supabase e envia e-mail com login e senha temporária.
2. Cliente acessa `/login`.
3. `/onboarding` — escolhe seu perfil de partida (3 opções).
4. `/diagnostico` — responde 4 perguntas sim/não.
5. `/configuracao` — vê **apenas** os passos de configuração que ainda não concluiu,
   com base nas respostas do diagnóstico.
6. `/modulos` — escolhe entre Campanha de Mensagens ou Campanha de Seguidores.
7. `/modulos/mensagens` ou `/modulos/seguidores` — passo a passo detalhado, com
   progresso salvo a cada etapa concluída.

Todo o progresso é salvo no Supabase (tabela `user_progress`), então o cliente
sempre retoma de onde parou.

## Configuração do projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar o projeto no Supabase

1. Crie um projeto em https://supabase.com
2. No SQL Editor, execute o conteúdo de `supabase/migrations/0001_init.sql`
3. Em **Authentication → Email**, desative a confirmação de e-mail por link mágico
   se quiser que o login/senha funcione imediatamente após o webhook (o webhook já
   cria o usuário com `email_confirm: true`)
4. Copie as chaves em **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (segredo — nunca expor no client)

### 3. Configurar o Resend (envio de e-mail)

1. Crie uma conta em https://resend.com e verifique seu domínio de envio
2. Gere uma API key → `RESEND_API_KEY`
3. Defina o remetente em `EMAIL_FROM` (precisa ser do domínio verificado)

### 4. Configurar o webhook da Hotmart

1. No painel da Hotmart, vá em **Ferramentas → Webhook**
2. Cadastre a URL: `https://seudominio.com/api/webhook/hotmart`
3. Copie o token (`hottok`) gerado e defina em `HOTMART_WEBHOOK_TOKEN`
4. Marque os eventos: `Compra aprovada` (`PURCHASE_APPROVED`)

### 5. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha todos os valores.

```bash
cp .env.local.example .env.local
```

### 6. Rodar localmente

```bash
npm run dev
```

Acesse http://localhost:3000 — você será redirecionado para `/login`.

> Para testar sem uma compra real na Hotmart, crie um usuário manualmente em
> **Supabase → Authentication → Users** e insira a linha correspondente na tabela
> `profiles` com o mesmo `id`.

## Estrutura de pastas

```
src/
  app/
    login/                      Tela de login
    esqueci-senha/              Recuperação de senha
    redefinir-senha/            Definir nova senha (link do e-mail)
    onboarding/                 Seleção de perfil inicial (3 opções)
    diagnostico/                Perguntas sim/não
    configuracao/               Passos de setup personalizados
    modulos/                    Escolha do módulo de campanha
      mensagens/                Passo a passo — Campanha de Mensagens
      seguidores/                Passo a passo — Campanha de Seguidores
    api/webhook/hotmart/        Endpoint do webhook da Hotmart
  components/
    ui/                         Button, Card, ProgressBar, Badge
    auth/                       Formulários de login/recuperação de senha
    onboarding/                 Cards de perfil e perguntas do diagnóstico
    steps/                      StepCard, DifficultyHelp, ModuleCard, ModuleStepFlow
  lib/
    supabase/                   Clientes browser/server/admin
    hotmart/                    Validação de token + tipos do payload
    email/                      Cliente Resend + template do e-mail de boas-vindas
    steps/stepsConfig.ts        Conteúdo do guia (todas as etapas, baseadas no ebook)
  types/database.types.ts       Tipos das tabelas do Supabase
  middleware.ts                 Proteção de rotas + refresh de sessão
supabase/migrations/0001_init.sql  Schema completo (tabelas, RLS, triggers)
```

## Personalizar o conteúdo do guia

Todo o conteúdo (textos, links, dicas, avisos e opções de "Tive dificuldade") está
centralizado em `src/lib/steps/stepsConfig.ts`. Para editar um passo, alterar um link
oficial do Meta ou adicionar uma nova etapa, basta editar esse arquivo — nenhuma tela
precisa ser tocada.
