import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { withRole } from "@/lib/auth"

const createSessionSchema = z.object({
  userId: z.string().cuid(),
  expiresAt: z.coerce.date(),
})

const sessionResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
})

export const POST = withRole(async (req: NextRequest) => {
  const idempotencyKey = req.headers.get("idempotency-key")
  if (!idempotencyKey) {
    return NextResponse.json({ error: "Missing idempotency key" }, { status: 400 })
  }
  const cacheKey = `session:create:${idempotencyKey}`
  const cached = await redis.get(cacheKey)
  if (cached) {
    const data = sessionResponseSchema.parse(JSON.parse(cached))
    return NextResponse.json(data)
  }
  const body = await req.json()
  const parsed = createSessionSchema.parse(body)
  const session = await prisma.session.create({
    data: { userId: parsed.userId, expiresAt: parsed.expiresAt },
  })
  const data = sessionResponseSchema.parse(session)
  await redis.set(cacheKey, JSON.stringify(data), "EX", 60)
  return NextResponse.json(data)
}, ["admin"])

const getSessionSchema = z.object({ id: z.string().cuid() })

export const GET = withRole(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const params = getSessionSchema.parse({ id: searchParams.get("id") })
  const session = await prisma.session.findUnique({ where: { id: params.id } })
  if (!session) {
    return NextResponse.json({ error: "Not Found" }, { status: 404 })
  }
  const data = sessionResponseSchema.parse(session)
  return NextResponse.json(data)
}, ["admin", "user"])
