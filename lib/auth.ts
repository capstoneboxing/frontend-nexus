// lib/auth.ts
// ============================================================
// Helpers for storing/reading the JWT token from localStorage
// Use these in any page that needs to call the backend API
// ============================================================

const TOKEN_KEY = "nexus_token"
const USER_KEY = "nexus_user"
const API_BASE = "https://backend-nexus-capstone.up.railway.app"

// ----------------------------------------------------------
// Get the stored JWT token
// ----------------------------------------------------------
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

// ----------------------------------------------------------
// Get the stored user object
// ----------------------------------------------------------
export function getUser(): { username: string } | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// ----------------------------------------------------------
// Check if the user is logged in (token exists)
// ----------------------------------------------------------
export function isLoggedIn(): boolean {
  return !!getToken()
}

// ----------------------------------------------------------
// Log out — clear token and redirect to login
// ----------------------------------------------------------
export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.location.href = "/login"
}




// ----------------------------------------------------------
// Pre-built fetch with Authorization header
// Use this instead of plain fetch() for protected endpoints
//
// Example:
//   const res = await apiFetch("/api/v1/admins")
//   const data = await res.json()
// ----------------------------------------------------------
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()

  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
}