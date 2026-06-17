import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import LoginForm from "@/components/auth/login-form";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user?.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        onboardingCompleted: true,
      },
    });

    if (!user?.onboardingCompleted) {
      redirect("/onboarding");
    }

    redirect("/inbox");
  }

  return <LoginForm />;
}