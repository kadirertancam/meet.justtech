import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

interface Props {
  params: { id: string }
}

export default async function EditListingPage({ params }: Props) {
  const [listing, coinPacks] = await Promise.all([
    prisma.listing.findUnique({ where: { id: params.id } }),
    prisma.coinPack.findMany(),
  ])

  if (!listing) {
    return <div>Listing not found</div>
  }

  async function updateListing(formData: FormData) {
    'use server'
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      redirect("/api/auth/signin")
    }
    const coinPackId = formData.get("coinPackId")?.toString() || null
    const price = Number(formData.get("price"))
    await prisma.listing.update({
      where: { id: params.id },
      data: {
        coinPackId,
        price,
      },
    })
    redirect("/listings")
  }

  return (
    <form action={updateListing} className="space-y-4">
      <div>
        <label className="mb-1 block">Coin Pack</label>
        <select
          name="coinPackId"
          defaultValue={listing.coinPackId ?? ""}
          className="w-full rounded border p-2"
        >
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
          defaultValue={listing.price}
          className="w-full rounded border p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white"
      >
        Save
      </button>
    </form>
  )
}

