"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { clearAuth } from "@/lib/auth"

export default function LogoutPage() {
    const router = useRouter()

    useEffect(() => {
        clearAuth()
        router.replace("/dashboard")
    }, [router])

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Signing you out...
            </div>
        </div>
    )
}