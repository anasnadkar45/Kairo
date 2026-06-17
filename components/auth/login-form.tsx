"use client"
import { authClient } from '@/lib/auth-client';
import React from 'react'
import { Button } from '../ui/button';

const LoginForm = () => {

    const handleGoogleLogin = async () => {
        const { data, error } = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/onboarding",
        })
    }
    return (
        <main className="min-h-screen flex items-center justify-center bg-card px-4">
            <div className="w-full max-w-md rounded-2xl p-6 border">
                <h1 className="text-2xl font-semibold mb-2">Login</h1>
                <p className="text-sm text-muted-foreground mb-6">
                    Welcome back. Login to continue.
                </p>

                <Button
                    onClick={handleGoogleLogin}
                >
                    Continue with Google
                </Button>
            </div>
        </main>
    )
}

export default LoginForm