"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock, User, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const API_BASE = "http://backend-nexus-capstone.up.railway.app"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // ----------------------------------------------------------
  // Submit — POST /api/v1/auth/login
  // ----------------------------------------------------------
  const handleLogin = async () => {
    setError("")

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.message || "Invalid username or password.")
        setLoading(false)
        return
      }

      const data = await res.json()

      // Store the JWT token so other pages can use it
      localStorage.setItem("nexus_token", data.token)
      localStorage.setItem("nexus_user", JSON.stringify({ username: data.username ?? username }))

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      console.error("Login error:", err)
      setError("Could not connect to the server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Allow pressing Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">

        {/* Logo / Branding */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
            <Swords className="size-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Nexus Boxing
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your admin account
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg space-y-5">

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-border bg-secondary pl-9 text-foreground placeholder:text-muted-foreground"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-border bg-secondary pl-9 text-foreground placeholder:text-muted-foreground"
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Submit */}
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Nexus Boxing Admin System &mdash; Authorized users only
        </p>
      </div>
    </div>
  )
}
