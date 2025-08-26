import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import type { Role } from "@prisma/client"

export function withRole(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  roles: string[]
) {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions)
    const role = (session?.user as { role?: Role })?.role
    if (!session || !role || !roles.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return handler(req)
  }
}
