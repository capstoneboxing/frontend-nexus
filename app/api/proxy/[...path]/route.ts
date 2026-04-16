import { NextRequest, NextResponse } from "next/server"

const BACKEND = process.env.BACKEND_URL

if (!BACKEND) {
  throw new Error("BACKEND_URL is not defined in environment variables")
}

async function handler(req: NextRequest) {
  const url = req.nextUrl.pathname.replace("/api/proxy", "")
  const search = req.nextUrl.search ?? ""
  const fullUrl = `${BACKEND}${url}${search}`

  const headers: Record<string, string> = {}
  const auth = req.headers.get("Authorization")

  if (auth) {
    headers["Authorization"] = auth
  }

  const incomingContentType = req.headers.get("Content-Type")
  if (incomingContentType) {
    headers["Content-Type"] = incomingContentType
  }

  let body: string | undefined
  if (req.method !== "GET" && req.method !== "HEAD") {
    try {
      const raw = await req.text()
      body = raw || undefined
    } catch {
      body = undefined
    }
  }

  console.log(`[Proxy] ${req.method} ${fullUrl}`)

  try {
    const backendRes = await fetch(fullUrl, {
      method: req.method,
      headers,
      body,
    })

    const responseHeaders = new Headers()
    const backendContentType = backendRes.headers.get("Content-Type")

    if (backendContentType) {
      responseHeaders.set("Content-Type", backendContentType)
    }

    responseHeaders.set("Access-Control-Allow-Origin", "*")

    if (backendRes.status === 204 || backendRes.status === 205) {
      return new NextResponse(null, {
        status: backendRes.status,
        headers: responseHeaders,
      })
    }

    const text = await backendRes.text()

    return new NextResponse(text, {
      status: backendRes.status,
      headers: responseHeaders,
    })
  } catch (err) {
    console.error("[Proxy] Error:", err)
    return NextResponse.json(
        { message: "Proxy error — could not reach backend" },
        { status: 502 }
    )
  }
}

export async function GET(req: NextRequest) {
  return handler(req)
}

export async function POST(req: NextRequest) {
  return handler(req)
}

export async function PUT(req: NextRequest) {
  return handler(req)
}

export async function DELETE(req: NextRequest) {
  return handler(req)
}

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