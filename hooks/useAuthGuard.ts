"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isLoggedIn } from "@/lib/auth"

export function useAuthGuard(): boolean {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const loggedIn = isLoggedIn()

    if (!loggedIn) {
      router.replace("/login")
      return
    }

    setReady(true)
  }, [router])

  return ready
}