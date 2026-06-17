"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { setupCorsair } from "corsair";
import { auth } from "@/lib/auth";
import { corsair } from "@/lib/corsair";
import db from "@/lib/db";

export async function setupWorkspaceAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const workspaceName = formData.get("workspaceName") as string;

  if (!workspaceName?.trim()) {
    throw new Error("Workspace name is required");
  }

  const tenantId = session.user.id;

  await setupCorsair(corsair, {
    tenantId,
  });

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      workspaceName: workspaceName.trim(),
    },
  });

  revalidatePath("/onboarding");
}