import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
    include: { coinPack: true },
  })
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Listings</h1>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id} className="mb-2">
            <Link href={`/listings/${listing.id}`}>
              {listing.coinPack?.name ?? "Listing"} - ${'{'}listing.price / 100{'}'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
