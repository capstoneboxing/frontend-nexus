"use client"
// hooks/useAuthGuard.ts

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"

// Returns true once auth check is done and user is confirmed logged in.
// Use the returned `ready` flag to avoid rendering protected content
// before the check completes (prevents flash of content before redirect).
//
// Usage in any dashboard page:
//   const ready = useAuthGuard()
//   if (!ready) return null
//
export function useAuthGuard(): boolean {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login")
    } else {
      setReady(true)
    }
  }, [router])

  return ready
}