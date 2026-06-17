import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React, { ReactNode } from 'react'

const layout = async ({ children }: { children: ReactNode }) => {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user.id) {
        redirect("/login")
    }

    const user = await db.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            onboardingCompleted: true,
            workspaceName:true,
            calendarConnected:true,
            gmailConnected:true
        }
    })

    if (
        !user?.workspaceName ||
        !user?.gmailConnected ||
        !user?.calendarConnected ||
        !user?.onboardingCompleted
    ) {
        redirect("/onboarding");
    }
    return (
        <div>{children}</div>
    )
}

export default layout