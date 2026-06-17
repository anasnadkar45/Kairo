"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                    router.refresh();
                },
            },
        });
    }

    return (
        <Button
            onClick={handleLogout}
            variant={"destructive"}
        >
            Logout
        </Button>
    );
}