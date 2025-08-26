import { prisma } from "@/lib/prisma"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

export default async function CoinPacksPage() {
  const coinPacks = await prisma.coinPack.findMany()
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Coin Packs</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Coins</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coinPacks.map((pack) => (
            <TableRow key={pack.id}>
              <TableCell>{pack.name}</TableCell>
              <TableCell>{pack.coins}</TableCell>
              <TableCell>${'{'}pack.price / 100{'}'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
