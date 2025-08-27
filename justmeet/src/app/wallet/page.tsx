"use client"

import { useEffect } from "react"
import { useWalletStore } from "@/lib/store"

export default function WalletPage() {
  const { balance, fetchBalance } = useWalletStore()

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Wallet</h1>
      <p>Balance: {balance} coins</p>
    </div>
  )
}
