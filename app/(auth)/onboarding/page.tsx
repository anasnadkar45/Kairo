import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import OnboardingForm from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      onboardingCompleted: true,
      workspaceName: true,
      gmailConnected: true,
      calendarConnected: true,
    },
  });

  if (user?.onboardingCompleted) {
    redirect("/dashboard");
  }

  return (
    <OnboardingForm
      hasWorkspace={Boolean(user?.workspaceName)}
      gmailConnected={Boolean(user?.gmailConnected)}
      calendarConnected={Boolean(user?.calendarConnected)}
    />
  );
}