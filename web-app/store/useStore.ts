// store/useStore.ts
import { Network, networks } from '@autonomys/auto-utils'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export enum NetworkOptions {
  AUTO_EVM = 'auto-evm-taurus',
  CONSENSUS = 'consensus-taurus'
}

interface NetworkState {
  network: NetworkOptions
  setNetwork: (network: NetworkOptions) => void
  networks: Network[]
  setNetworks: (networks: Network[]) => void
}

export const useNetworkStore = create<NetworkState>()(
  persist(
    (set) => ({
      network: NetworkOptions.AUTO_EVM,
      setNetwork: (network: NetworkOptions) => set({ network }),
      networks: networks,
      setNetworks: (networks: Network[]) => set({ networks })
    }),
    {
      name: 'network-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
