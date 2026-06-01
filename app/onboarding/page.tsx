import { OnboardingModule } from "@/components/modules/onboarding-module";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams?: Promise<{ step?: string | string[] }>;
}) {
  const params = await searchParams;
  const step = Array.isArray(params?.step) ? params.step[0] : params?.step;

  return <OnboardingModule initialStepKey={step} />;
}
