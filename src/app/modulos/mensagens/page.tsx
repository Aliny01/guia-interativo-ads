import { ModuleStepFlow } from "@/components/steps/ModuleStepFlow";

export const dynamic = "force-dynamic";

export default function CampanhaMensagensPage() {
  return (
    <ModuleStepFlow
      moduleKey="mensagens"
      title="Campanha de Mensagens"
      subtitle="Ideal para quem vende pelo WhatsApp — siga os passos na ordem."
      successMessage="Campanha publicada! O Meta revisa em até 24h. Volte aqui para acompanhar os resultados."
    />
  );
}
