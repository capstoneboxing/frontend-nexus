"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, User, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login } from "@/lib/api"
import { isLoggedIn, saveAuth } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isLoggedIn()) router.replace("/dashboard")
  }, [router])

  const handleLogin = async () => {
    setError("")

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.")
      return
    }

    setLoading(true)

    try {
      const data = await login({
        username: username.trim(),
        password,
      })

      if (!data.token) {
        setError("Login failed. No token was returned.")
        return
      }

      saveAuth(data.token, data.username ?? username.trim())
      router.replace("/dashboard")
    } catch (err: any) {
      console.error("Login error:", err)
      setError("Invalid username or password.")
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleLogin()
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-8">
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

          <div className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-lg">
            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="border-border bg-secondary pl-9 text-foreground placeholder:text-muted-foreground"
                    autoComplete="username"
                    autoFocus
                    disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="border-border bg-secondary px-9 text-foreground placeholder:text-muted-foreground"
                    autoComplete="current-password"
                    disabled={loading}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                >
                  {showPassword ? (
                      <EyeOff className="size-4" />
                  ) : (
                      <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            <Button
                onClick={() => void handleLogin()}
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
            Nexus Boxing Admin System — Authorized users only
          </p>
        </div>
      </div>
  )
}