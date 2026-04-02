// lib/auth.ts
// ============================================================
// All API calls go through /api/proxy/* (Next.js server-side)
// to avoid CORS issues with the Railway backend.
// ============================================================

// Use relative path so it works on both localhost and Vercel
const PROXY = "/api/proxy"

export const API_BASE = "https://backend-nexus-capstone.up.railway.app" // kept for reference only

const TOKEN_KEY = "nexus_token"
const USER_KEY  = "nexus_user"

// ----------------------------------------------------------
// Token helpers
// ----------------------------------------------------------
export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): { username: string; adminId?: number } | null {
  if (typeof window === "undefined") return null
  try { return JSON.parse(localStorage.getItem(USER_KEY) ?? "") } catch { return null }
}

export function isLoggedIn(): boolean { return !!getToken() }

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  window.location.href = "/login"
}

export function saveAuth(token: string, username: string, adminId?: number) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify({ username, adminId }))
}

// ----------------------------------------------------------
// Base fetch — goes through proxy, auto-attaches Bearer token
// ----------------------------------------------------------
export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  return fetch(`${PROXY}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })
}

// ----------------------------------------------------------
// Auth
// ----------------------------------------------------------
export async function login(username: string, password: string) {
  // Login is public — no token needed, still goes through proxy
  return fetch(`${PROXY}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
}

// ----------------------------------------------------------
// Boxers
// ----------------------------------------------------------
export async function getActiveBoxersByWeightClass(weightClassId: number) {
  return apiFetch(`/api/v1/all-time-ranked-boxers/weight-class/${weightClassId}/active`)
}

export async function generateBoxerProfile(boxerName: string, weightClassId: number) {
  return apiFetch("/api/v1/all-time-ranked-boxers/generate-profile", {
    method: "POST",
    body: JSON.stringify({ boxerName, weightClassId }),
  })
}

export async function updateBoxer(id: number, data: Record<string, unknown>) {
  return apiFetch(`/api/v1/all-time-ranked-boxers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

// ----------------------------------------------------------
// Predictions
// ----------------------------------------------------------
export async function getAllPredictions() {
  return apiFetch("/api/v1/prediction-history")
}

export async function deletePrediction(id: number) {
  return apiFetch(`/api/v1/prediction-history/${id}`, { method: "DELETE" })
}

// ----------------------------------------------------------
// Weight Classes (public)
// ----------------------------------------------------------
export async function getWeightClasses() {
  // Public endpoint — no token needed
  return fetch(`${PROXY}/api/v1/weight-classes`)
}

// ----------------------------------------------------------
// Perfect Boxer
// ----------------------------------------------------------
export async function regeneratePerfectBoxer(weightClassId: number) {
  return apiFetch(`/api/v1/perfect-boxers/regenerate/weight-class/${weightClassId}`, {
    method: "POST",
  })
}