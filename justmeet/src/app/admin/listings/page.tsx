import { prisma } from "@/lib/prisma"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
    include: { user: true, coinPack: true },
  })
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Listings</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Coin Pack</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell>{listing.user.email}</TableCell>
              <TableCell>{listing.coinPack?.name ?? ""}</TableCell>
              <TableCell>${'{'}listing.price / 100{'}'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
