import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function NewListingPage() {
  const coinPacks = await prisma.coinPack.findMany()

  async function createListing(formData: FormData) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      redirect("/api/auth/signin")
    }
    const coinPackId = formData.get("coinPackId")?.toString() || null
    const price = Number(formData.get("price"))
    await prisma.listing.create({
      data: {
        userId: session.user.id as string,
        coinPackId,
        price,
      },
    })
    redirect("/listings")
  }

  return (
    <form action={createListing} className="space-y-4">
      <div>
        <label className="mb-1 block">Coin Pack</label>
        <select name="coinPackId" className="w-full rounded border p-2">
          <option value="">None</option>
          {coinPacks.map((pack) => (
            <option key={pack.id} value={pack.id}>
              {pack.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1 block">Price (cents)</label>
        <input
          type="number"
          name="price"
          className="w-full rounded border p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Create
      </button>
    </form>
  )
}

