"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { corsair } from "@/lib/corsair";
import db from "@/lib/db";

async function getTenantId() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user?.id) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            gmailConnected: true,
            onboardingCompleted: true,
        },
    });

    if (!user?.gmailConnected) {
        throw new Error("Gmail is not connected");
    }

    return session.user.id;
}

function encodeEmailToBase64Url({
    to,
    subject,
    body,
}: {
    to: string;
    subject: string;
    body: string;
}) {
    const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        "Content-Type: text/plain; charset=utf-8",
        "",
        body,
    ].join("\r\n");

    return Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function getEmailsAction() {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    return await gmail.api.messages.list({
        userId: "me",
        maxResults: 20,
    });
}

export async function searchEmailsAction(query: string) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    return await gmail.api.messages.list({
        userId: "me",
        q: query,
        maxResults: 20,
    });
}

export async function getEmailAction(messageId: string) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    return await gmail.api.messages.get({
        userId: "me",
        id: messageId,
        format: "full",
    });
}

export async function getThreadAction(threadId: string) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    return await gmail.api.threads.get({
        userId: "me",
        id: threadId,
        format: "full",
    });
}

export async function sendEmailAction({
    to,
    subject,
    body,
}: {
    to: string;
    subject: string;
    body: string;
}) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    const raw = encodeEmailToBase64Url({
        to,
        subject,
        body,
    });

    const result = await gmail.api.messages.send({
        userId: "me",
        raw,
    });

    revalidatePath("/dashboard");

    return result;
}

export async function trashEmailAction(messageId: string) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    const result = await gmail.api.messages.trash({
        userId: "me",
        id: messageId,
    });

    revalidatePath("/dashboard");

    return result;
}

export async function untrashEmailAction(messageId: string) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    const result = await gmail.api.messages.untrash({
        userId: "me",
        id: messageId,
    });

    revalidatePath("/dashboard");

    return result;
}

export async function markEmailAsReadAction(messageId: string) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    const result = await gmail.api.messages.modify({
        userId: "me",
        id: messageId,
        removeLabelIds: ["UNREAD"],
    });

    revalidatePath("/dashboard");

    return result;
}

export async function markEmailAsUnreadAction(messageId: string) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    const result = await gmail.api.messages.modify({
        userId: "me",
        id: messageId,
        addLabelIds: ["UNREAD"],
    });

    revalidatePath("/dashboard");

    return result;
}

export async function getLabelsAction() {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    return await gmail.api.labels.list({
        userId: "me",
    });
}

export async function searchLocalEmailsAction(query: string) {
    const tenantId = await getTenantId();

    const gmail = corsair.withTenant(tenantId).gmail;

    return await gmail.db.messages.search({
        data: {
            subject: {
                contains: query,
            },
        },
        limit: 20,
        offset: 0,
    });
}

export async function searchLocalEmailsBySenderAction(sender: string) {
  const tenantId = await getTenantId();

  const gmail = corsair.withTenant(tenantId).gmail;

  return await gmail.db.messages.search({
    data: {
      from: {
        contains: sender,
      },
    },
    limit: 20,
    offset: 0,
  });
}

export async function searchLocalLabelsAction() {
  const tenantId = await getTenantId();

  const gmail = corsair.withTenant(tenantId).gmail;

  return await gmail.db.labels.search({
    data: {
      messagesUnread: {
        gt: 0,
      },
    },
    limit: 20,
    offset: 0,
  });
}