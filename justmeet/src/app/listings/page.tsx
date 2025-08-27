import Link from "next/link"
import { prisma } from "@/lib/prisma"

export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
    include: { coinPack: true },
  })
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Listings</h1>
      <div className="mb-4">
        <Link
          href="/listings/new"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          New Listing
        </Link>
      </div>
      <ul>
        {listings.map((listing) => (
          <li key={listing.id} className="mb-2">
            <Link href={`/listings/${listing.id}`}>
              {listing.coinPack?.name ?? "Listing"} - ${'{'}listing.price / 100{'}'}
            </Link>
            <Link
              href={`/listings/${listing.id}/edit`}
              className="ml-2 text-sm text-blue-500"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
