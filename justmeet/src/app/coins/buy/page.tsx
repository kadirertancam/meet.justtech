import { prisma } from "@/lib/prisma"
import BuyButton from "./buy-button"

export default async function BuyCoinsPage() {
  const packs = await prisma.coinPack.findMany()
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Buy Coins</h1>
      <ul>
        {packs.map((pack) => (
          <li key={pack.id} className="mb-2">
            {pack.name} - {pack.coins} coins - ${'{'}pack.price / 100{'}'}
            <BuyButton packId={pack.id} />
          </li>
        ))}
      </ul>
    </div>
  )
}
