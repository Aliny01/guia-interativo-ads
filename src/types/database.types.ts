export type ProfileType =
  | "zero"
  | "tem_conta_nunca_anunciou"
  | "usou_impulsionar";

export type ModuleKey = "setup" | "mensagens" | "seguidores";

export type ProgressStatus = "pending" | "completed";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  hotmart_transaction_id: string | null;
  hotmart_product_id: string | null;
  profile_type: ProfileType | null;
  current_module: "mensagens" | "seguidores" | null;
  created_at: string;
  updated_at: string;
};

export type OnboardingResponses = {
  user_id: string;
  has_facebook_profile: boolean | null;
  has_facebook_page: boolean | null;
  has_business_manager: boolean | null;
  instagram_is_business: boolean | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProgress = {
  id: string;
  user_id: string;
  module: ModuleKey;
  step_key: string;
  status: ProgressStatus;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      onboarding_responses: {
        Row: OnboardingResponses;
        Insert: Partial<OnboardingResponses> & { user_id: string };
        Update: Partial<OnboardingResponses>;
        Relationships: [];
      };
      user_progress: {
        Row: UserProgress;
        Insert: Partial<UserProgress> & {
          user_id: string;
          module: ModuleKey;
          step_key: string;
        };
        Update: Partial<UserProgress>;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
  };
};
