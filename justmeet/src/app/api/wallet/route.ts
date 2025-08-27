import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export const GET = async () => {
  const session = await getServerSession(authOptions)
  const email = session?.user?.email
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { email },
    include: { wallet: true },
  })
  const balance = user?.wallet?.balance ?? 0
  return NextResponse.json({ balance })
}
