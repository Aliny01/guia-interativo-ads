import type { OnboardingResponses } from "@/types/database.types";

export interface DifficultyOption {
  problem: string;
  solution: string;
}

export interface GuideStep {
  key: string;
  title: string;
  icon: string;
  description?: string;
  instructions: string[];
  link?: { label: string; url: string };
  tip?: string;
  warning?: string;
  example?: string;
  /** Se retornar false, o passo é pulado para esse cliente. */
  condition?: (answers: OnboardingResponses | null) => boolean;
  difficulty?: DifficultyOption[];
}

// ---------------------------------------------------------------
// Módulo "setup" — configuração inicial (Capítulo 2 do ebook)
// Cada etapa só aparece se o cliente respondeu "não" na pergunta
// correspondente do diagnóstico.
// ---------------------------------------------------------------
export const setupSteps: GuideStep[] = [
  {
    key: "perfil_facebook",
    title: "Criar perfil pessoal no Facebook",
    icon: "👤",
    description:
      "O Gerenciador de Anúncios é vinculado a uma pessoa real — não a uma empresa.",
    instructions: [
      "Acesse facebook.com e crie uma conta",
      "Use um e-mail e número de celular que você acesse sempre",
      "Pode ser o perfil de alguém de confiança, desde que você tenha acesso total",
    ],
    link: { label: "facebook.com", url: "https://www.facebook.com" },
    tip: "Não precisa ser necessariamente seu perfil — pode ser de um familiar, desde que você tenha acesso completo à conta.",
    condition: (answers) => answers?.has_facebook_profile !== true,
    difficulty: [
      {
        problem: "Não sei se já tenho um perfil ou esqueci a senha",
        solution:
          "Acesse facebook.com/login/identify para recuperar o acesso com seu e-mail ou celular cadastrado.",
      },
    ],
  },
  {
    key: "pagina_facebook",
    title: "Criar a Página do Facebook",
    icon: "📄",
    description:
      "A Página representa o seu negócio. É obrigatória para anunciar no Instagram.",
    instructions: [
      'Acesse seu perfil pessoal e clique em "Páginas"',
      'Clique em "Criar nova Página"',
      "Coloque o nome do seu negócio",
      "Escolha a categoria mais próxima do seu ramo",
      "Adicione foto de perfil e capa",
      'Clique em "Criar Página"',
    ],
    link: {
      label: "facebook.com/pages/creation",
      url: "https://www.facebook.com/pages/creation/",
    },
    tip: "Não precisa ter muitos seguidores na Página para anunciar — ela só precisa existir e estar ativa.",
    condition: (answers) => answers?.has_facebook_page !== true,
  },
  {
    key: "business_manager",
    title: "Criar conta no Facebook Business",
    icon: "🏢",
    description:
      "O painel central onde você gerencia seus anúncios, pagamentos e contas conectadas.",
    instructions: [
      "Acesse business.facebook.com",
      'Clique em "Criar conta"',
      "Preencha o nome do negócio, seu nome e seu e-mail",
      "Siga as instruções de verificação",
    ],
    link: {
      label: "business.facebook.com",
      url: "https://business.facebook.com",
    },
    tip: "Use um e-mail que você acessa com frequência — todas as notificações importantes chegam por ali.",
    condition: (answers) => answers?.has_business_manager !== true,
  },
  {
    key: "conectar_instagram",
    title: "Conectar o Instagram à Página",
    icon: "🔗",
    description:
      "Sem essa conexão você não consegue anunciar no Instagram pelo Gerenciador.",
    instructions: [
      'No Facebook Business, acesse "Configurações do negócio"',
      'Clique em "Contas" → "Contas do Instagram"',
      'Clique em "Adicionar" e faça login com seu Instagram',
      "Confirme a conexão",
    ],
    link: {
      label: "business.facebook.com/settings/instagram-accounts",
      url: "https://business.facebook.com/settings/instagram-accounts",
    },
    warning:
      "Seu perfil do Instagram precisa ser conta comercial ou de criador. Se ainda for pessoal: Configurações do Instagram → Conta → Mudar para conta profissional.",
    condition: (answers) => answers?.instagram_is_business !== true,
    difficulty: [
      {
        problem: "Meu Instagram ainda é uma conta pessoal",
        solution:
          "No app do Instagram: Configurações → Conta → Mudar para conta profissional → escolha Criador ou Empresa.",
      },
      {
        problem: "Não encontro a opção de conectar contas do Instagram",
        solution:
          "Confirme que você é administrador da Página do Facebook e que o Business Manager já foi criado antes desta etapa.",
      },
    ],
  },
  {
    key: "conta_anuncios",
    title: "Criar a Conta de Anúncios",
    icon: "💳",
    description: "É onde você controla orçamento e pagamentos.",
    instructions: [
      'No Facebook Business, vá em "Configurações do negócio"',
      '"Contas de anúncios" → "Adicionar" → "Criar nova conta de anúncios"',
      "Nome, fuso horário (Brasília) e moeda (Real Brasileiro)",
      "Adicione um cartão de crédito ou débito",
    ],
    link: {
      label: "business.facebook.com/settings/ad-accounts",
      url: "https://business.facebook.com/settings/ad-accounts",
    },
    tip: "Use um cartão com limite disponível — o Meta cobra automaticamente conforme os anúncios rodam.",
    // Sempre exibida: mesmo quem já tem tudo o resto pode não ter conta de anúncios configurada.
  },
];

// ---------------------------------------------------------------
// Módulo "mensagens" — Campanha de Mensagens (Capítulo 4)
// ---------------------------------------------------------------
export const mensagensSteps: GuideStep[] = [
  {
    key: "msg_acessar_gerenciador",
    title: "Acessar o Gerenciador de Anúncios",
    icon: "🚪",
    instructions: [
      'Acesse facebook.com/adsmanager ou pelo Facebook Business em "Gerenciador de Anúncios"',
    ],
    link: { label: "facebook.com/adsmanager", url: "https://www.facebook.com/adsmanager" },
  },
  {
    key: "msg_criar_campanha",
    title: "Criar a campanha",
    icon: "🎯",
    instructions: [
      'Clique no botão verde "+ Criar"',
      'Selecione o objetivo "Engajamento"',
      'Em tipo de engajamento, selecione "Mensagens"',
      'Dê um nome — ex: "Mensagens WhatsApp"',
      'Clique em "Próximo"',
    ],
  },
  {
    key: "msg_configurar_conjunto",
    title: "Configurar o conjunto de anúncios",
    icon: "⚙️",
    instructions: [
      "Aplicativo de mensagens: selecione WhatsApp e conecte seu número",
      "Orçamento: comece com R$ 10 a R$ 15 por dia",
      "Público: cidade onde atende, idade, gênero e interesses do seu negócio",
      'Posicionamentos manuais: marque apenas Feed e Stories do Instagram',
      "Datas: defina início e deixe sem data de término",
    ],
    tip: "Comece com um orçamento pequeno para testar antes de escalar.",
  },
  {
    key: "msg_criar_anuncio",
    title: "Criar o anúncio",
    icon: "🖼️",
    instructions: [
      "Identidade: selecione sua Página e seu Instagram",
      "Formato: imagem única ou vídeo",
      "Texto principal: escreva a chamada do anúncio",
      'Botão de chamada para ação: "Enviar mensagem"',
      "Configure a mensagem automática de boas-vindas",
    ],
    example:
      '"Agende agora e garanta seu horário! Clique no botão e fale com a gente pelo WhatsApp 👇"',
    difficulty: [
      {
        problem: "Não sei o que escrever no texto do anúncio",
        solution:
          'Use uma chamada direta com benefício + ação, ex: "Agende agora e garanta seu horário! Clique no botão e fale com a gente pelo WhatsApp 👇"',
      },
    ],
  },
  {
    key: "msg_publicar",
    title: "Publicar",
    icon: "✅",
    instructions: [
      'Revise tudo e clique em "Publicar"',
      "O anúncio vai para revisão do Meta — aprovação em até 24 horas",
    ],
    tip: "Não pause nem altere o anúncio antes de 3 a 5 dias — o Meta precisa desse tempo para otimizar.",
  },
];

// ---------------------------------------------------------------
// Módulo "seguidores" — Campanha de Seguidores (Capítulo 5)
// ---------------------------------------------------------------
export const seguidoresSteps: GuideStep[] = [
  {
    key: "seg_acessar_gerenciador",
    title: "Acessar o Gerenciador de Anúncios",
    icon: "🚪",
    instructions: ["Acesse facebook.com/adsmanager"],
    link: { label: "facebook.com/adsmanager", url: "https://www.facebook.com/adsmanager" },
  },
  {
    key: "seg_criar_campanha",
    title: "Criar a campanha",
    icon: "🎯",
    instructions: [
      'Clique em "+ Criar"',
      'Selecione o objetivo "Reconhecimento"',
      'Escolha "Reconhecimento da marca" ou "Seguidores do perfil" (se disponível)',
      'Dê um nome — ex: "Seguidores Instagram"',
    ],
  },
  {
    key: "seg_configurar_conjunto",
    title: "Configurar o conjunto de anúncios",
    icon: "⚙️",
    instructions: [
      "Orçamento: R$ 10 por dia já funciona bem",
      "Público: igual à campanha de mensagens — localização, idade e interesses",
      "Posicionamento: Feed e Stories do Instagram",
    ],
  },
  {
    key: "seg_escolher_criativo",
    title: "Escolher o criativo",
    icon: "📸",
    instructions: [
      'Clique em "Usar publicação existente"',
      "Selecione um post que já teve bom engajamento orgânico",
    ],
    tip: "Escolha um post com imagem bonita e que já tenha curtidas e comentários — isso dá credibilidade para quem vê pela primeira vez.",
  },
  {
    key: "seg_publicar",
    title: "Publicar",
    icon: "✅",
    instructions: ['Revise tudo e clique em "Publicar"'],
  },
];

export function getSetupSteps(answers: OnboardingResponses | null): GuideStep[] {
  return setupSteps.filter((step) => !step.condition || step.condition(answers));
}

export function getModuleSteps(moduleKey: "mensagens" | "seguidores"): GuideStep[] {
  return moduleKey === "mensagens" ? mensagensSteps : seguidoresSteps;
}

export const profileOptions = [
  {
    key: "zero" as const,
    title: "Preciso configurar tudo do zero",
    icon: "🆕",
    description: "Ainda não tenho nada configurado para anunciar.",
  },
  {
    key: "tem_conta_nunca_anunciou" as const,
    title: "Já tenho conta mas nunca anunciei",
    icon: "📋",
    description: "Tenho perfil/página, mas nunca criei um anúncio.",
  },
  {
    key: "usou_impulsionar" as const,
    title: "Já anunciei pelo Impulsionar mas quero fazer certo",
    icon: "🔄",
    description: "Quero migrar para o Gerenciador de Anúncios profissional.",
  },
];

export const diagnosticoQuestions: {
  key: keyof Pick<
    OnboardingResponses,
    | "has_facebook_profile"
    | "has_facebook_page"
    | "has_business_manager"
    | "instagram_is_business"
  >;
  question: string;
}[] = [
  { key: "has_facebook_profile", question: "Você tem perfil pessoal no Facebook?" },
  { key: "has_facebook_page", question: "Você tem Página do Facebook?" },
  { key: "has_business_manager", question: "Você tem conta no Facebook Business?" },
  { key: "instagram_is_business", question: "Seu Instagram já é conta comercial?" },
];
