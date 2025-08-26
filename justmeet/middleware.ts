import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis"

const WINDOW = 60
const MAX_REQUESTS = 100

export async function middleware(req: NextRequest) {
  const ip = req.ip || req.headers.get("x-forwarded-for") || "unknown"
  const rateKey = `rate:${ip}`
  const idempotencyKey = req.headers.get("idempotency-key")

  const count = await redis.incr(rateKey)
  if (count === 1) await redis.expire(rateKey, WINDOW)
  if (count > MAX_REQUESTS) {
    return new NextResponse("Too Many Requests", { status: 429 })
  }

  if (idempotencyKey) {
    const idemKey = `idempotency:${idempotencyKey}`
    const exists = await redis.get(idemKey)
    if (exists) {
      return new NextResponse("Duplicate Request", { status: 409 })
    }
    await redis.set(idemKey, "1", "EX", WINDOW)
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}

