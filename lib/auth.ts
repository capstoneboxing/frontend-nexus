const TOKEN_KEY = "nexus_token"
const USER_KEY = "nexus_user"

export type StoredUser = {
  username: string
  adminId?: number
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as StoredUser) : null
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return !!getToken()
}

export function saveAuth(token: string, username: string, adminId?: number) {
  if (typeof window === "undefined") return

  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify({ username, adminId }))
}

export function clearAuth() {
  if (typeof window === "undefined") return

  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}