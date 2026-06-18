import Sidebar from '@/components/layout/protected/sidebar'
import Topbar from '@/components/layout/protected/topbar'
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
            workspaceName: true,
            calendarConnected: true,
            gmailConnected: true
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
        <div className="flex min-h-screen w-full overflow-hidden bg-secondary">
            <Sidebar />

            <main className="flex min-w-0 flex-1 flex-col">
                <Topbar />

                <section className="flex-1 overflow-y-auto bg-background rounded-lg m mr-2 mb-2">
                    {children}
                </section>
            </main>
        </div>
    )
}

export default layout