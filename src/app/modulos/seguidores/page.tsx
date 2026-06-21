import { ModuleStepFlow } from "@/components/steps/ModuleStepFlow";

export const dynamic = "force-dynamic";

export default function CampanhaSeguidoresPage() {
  return (
    <ModuleStepFlow
      moduleKey="seguidores"
      title="Campanha de Seguidores"
      subtitle="Faça seu perfil crescer com pessoas reais e interessadas."
      successMessage="Campanha publicada! Seu perfil já está crescendo com pessoas de verdade. 🎉"
    />
  );
}
