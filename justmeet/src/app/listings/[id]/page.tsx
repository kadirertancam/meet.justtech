import { prisma } from "@/lib/prisma"

export default async function ListingDetail({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: { coinPack: true, user: true },
  })
  if (!listing) {
    return <div>Listing not found</div>
  }
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{listing.coinPack?.name ?? "Listing"}</h1>
      <p>Seller: {listing.user.email}</p>
      <p>Price: ${'{'}listing.price / 100{'}'}</p>
    </div>
  )
}
