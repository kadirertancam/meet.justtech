import { create } from "zustand"

interface WalletState {
  balance: number
  fetchBalance: () => Promise<void>
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  async fetchBalance() {
    try {
      const res = await fetch("/api/wallet", { cache: "no-store" })
      if (!res.ok) return
      const data: { balance: number } = await res.json()
      set({ balance: data.balance })
    } catch {
      // ignore
    }
  },
}))
