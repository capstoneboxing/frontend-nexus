// app/api/proxy/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server"

const BACKEND = "https://backend-nexus-capstone.up.railway.app"

async function handler(req: NextRequest) {
  // Extract the path from the URL after /api/proxy/
  const url = req.nextUrl.pathname.replace("/api/proxy", "")
  const search = req.nextUrl.search ?? ""
  const fullUrl = `${BACKEND}${url}${search}`

  // Forward Authorization header if present
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  const auth = req.headers.get("Authorization")
  if (auth) headers["Authorization"] = auth

  // Forward body for POST/PUT
  let body: string | undefined
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      body = await req.text()
    } catch {
      body = undefined
    }
  }

  console.log(`[Proxy] ${req.method} ${fullUrl}`)

  try {
    const backendRes = await fetch(fullUrl, {
      method: req.method,
      headers,
      body: body || undefined,
    })

    const text = await backendRes.text()

    return new NextResponse(text, {
      status: backendRes.status,
      headers: {
        "Content-Type": backendRes.headers.get("Content-Type") ?? "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (err) {
    console.error("[Proxy] Error:", err)
    return NextResponse.json(
      { message: "Proxy error — could not reach backend" },
      { status: 502 }
    )
  }
}

export async function GET(req: NextRequest)    { return handler(req) }
export async function POST(req: NextRequest)   { return handler(req) }
export async function PUT(req: NextRequest)    { return handler(req) }
export async function DELETE(req: NextRequest) { return handler(req) }
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}