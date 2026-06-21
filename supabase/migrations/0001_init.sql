-- ============================================================
-- Guia Interativo Instagram — schema inicial
-- Execute este arquivo no SQL Editor do Supabase (ou via CLI:
-- supabase db push)
-- ============================================================

-- ------------------------------------------------------------
-- Tabela: profiles
-- Espelha auth.users (1:1). Criada manualmente pelo webhook da
-- Hotmart no momento da compra aprovada — não há trigger
-- automático em auth.users porque o cadastro só deve ocorrer
-- através da compra.
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  hotmart_transaction_id text,
  hotmart_product_id text,
  -- resposta da tela de boas-vindas: 'zero' | 'tem_conta_nunca_anunciou' | 'usou_impulsionar'
  profile_type text,
  -- módulo de campanha em que o cliente está focado agora: 'mensagens' | 'seguidores' | null
  current_module text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Dados do cliente, criados pelo webhook da Hotmart após compra aprovada.';

-- ------------------------------------------------------------
-- Tabela: onboarding_responses
-- Respostas do fluxo de diagnóstico (sim/não).
-- ------------------------------------------------------------
create table if not exists public.onboarding_responses (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  has_facebook_profile boolean,
  has_facebook_page boolean,
  has_business_manager boolean,
  instagram_is_business boolean,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.onboarding_responses is 'Respostas do diagnóstico inicial, usadas para personalizar os passos de configuração exibidos.';

-- ------------------------------------------------------------
-- Tabela: user_progress
-- Uma linha por etapa (step_key) que o cliente concluiu ou está
-- em andamento. step_key corresponde às chaves definidas em
-- src/lib/steps/stepsConfig.ts
-- ------------------------------------------------------------
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  module text not null, -- 'setup' | 'mensagens' | 'seguidores'
  step_key text not null,
  status text not null default 'pending', -- 'pending' | 'completed'
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, step_key)
);

comment on table public.user_progress is 'Progresso do cliente em cada etapa do guia. Permite retomar de onde parou.';

create index if not exists user_progress_user_id_idx on public.user_progress (user_id);
create index if not exists user_progress_module_idx on public.user_progress (user_id, module);

-- ------------------------------------------------------------
-- updated_at automático
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.onboarding_responses;
create trigger set_updated_at before update on public.onboarding_responses
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.user_progress;
create trigger set_updated_at before update on public.user_progress
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- RLS — cada cliente só acessa seus próprios dados.
-- A service role key (usada no webhook) ignora RLS por padrão.
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.onboarding_responses enable row level security;
alter table public.user_progress enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "onboarding_select_own" on public.onboarding_responses
  for select using (auth.uid() = user_id);

create policy "onboarding_upsert_own" on public.onboarding_responses
  for insert with check (auth.uid() = user_id);

create policy "onboarding_update_own" on public.onboarding_responses
  for update using (auth.uid() = user_id);

create policy "progress_select_own" on public.user_progress
  for select using (auth.uid() = user_id);

create policy "progress_insert_own" on public.user_progress
  for insert with check (auth.uid() = user_id);

create policy "progress_update_own" on public.user_progress
  for update using (auth.uid() = user_id);
