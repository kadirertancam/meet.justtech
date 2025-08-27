import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { coinPackId } = await req.json()
  if (!coinPackId) {
    return NextResponse.json({ error: "Missing coinPackId" }, { status: 400 })
  }
  const coinPack = await prisma.coinPack.findUnique({ where: { id: coinPackId } })
  if (!coinPack) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 })
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: { wallet: true },
  })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  const wallet = await prisma.wallet.upsert({
    where: { userId: user.id },
    update: {
      balance: { increment: coinPack.coins },
      transactions: { create: { amount: coinPack.coins } },
    },
    create: {
      userId: user.id,
      balance: coinPack.coins,
      transactions: { create: { amount: coinPack.coins } },
    },
  })
  return NextResponse.json({ balance: wallet.balance })
}
