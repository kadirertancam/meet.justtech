"use client"

import { useState } from "react"
import { useWalletStore } from "@/lib/store"

export default function BuyButton({ packId }: { packId: string }) {
  const { fetchBalance } = useWalletStore()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    await fetch("/api/coins/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coinPackId: packId }),
    })
    await fetchBalance()
    setLoading(false)
  }

  return (
    <button onClick={handleClick} disabled={loading} className="ml-2 px-2 py-1 border">
      {loading ? "Processing..." : "Buy"}
    </button>
  )
}
