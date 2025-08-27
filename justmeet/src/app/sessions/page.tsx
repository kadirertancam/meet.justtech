import Link from "next/link"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function SessionsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return <div>Please sign in to view your sessions.</div>
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: session.user.id as string,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Live Sessions</h1>
      <ul>
        {sessions.map((s) => (
          <li key={s.id} className="mb-2">
            <Link href={`/session/${s.id}`}>{s.id}</Link> -
            <span className="ml-1 text-sm text-gray-600">
              expires {s.expiresAt.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

