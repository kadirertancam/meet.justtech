"use client"

import { useEffect } from "react"
import { useWalletStore } from "@/lib/store"

export default function WalletBalance() {
  const { balance, fetchBalance } = useWalletStore()

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return <div className="p-2">Balance: {balance} coins</div>
}
