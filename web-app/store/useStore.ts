// store/useStore.ts
import { Network, networks } from '@autonomys/auto-utils'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export enum NetworkOptions {
  AUTO_EVM = 'auto-evm-chronos'
}

interface NetworkState {
  network: NetworkOptions
  setNetwork: (network: NetworkOptions) => void
  networks: Network[]
  version: number
  setNetworks: (networks: Network[]) => void
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      network: NetworkOptions.AUTO_EVM,
      setNetwork: (network: NetworkOptions) => set({ network }),
      networks: networks,
      version: 1,
      setNetworks: (networks: Network[]) => set({ networks }),
      activeTab: 'github',
      setActiveTab: (tab: string) => set({ activeTab: tab })
    }),
    {
      name: 'network-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1
    }
  )
)
