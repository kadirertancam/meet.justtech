import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"
import { redis } from "@/lib/redis"
import type { Role } from "@prisma/client"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) (token as { role?: Role }).role = (user as { role: Role }).role
      return token
    },
    async session({ session, token }) {
      if (session.user)
        (session.user as { role?: Role }).role = (token as { role?: Role }).role
      return session
    },
  },
  events: {
    async signIn() {
      await redis.incr("sessions:active")
    },
    async signOut() {
      await redis.decr("sessions:active")
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

