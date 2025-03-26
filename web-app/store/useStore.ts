// store/useStore.ts
import { Network, networks } from '@autonomys/auto-utils'
import { create } from 'zustand'

export enum NetworkOptions {
  AUTO_EVM = 'autoEVM',
  CONSENSUS = 'consensus'
}

interface NetworkState {
  network: NetworkOptions
  setNetwork: (network: NetworkOptions) => void
  networks: Network[]
  setNetworks: (networks: Network[]) => void
}

export const useNetworkStore = create<NetworkState>((set) => ({
  network: NetworkOptions.AUTO_EVM,
  setNetwork: (network: NetworkOptions) => set({ network }),
  networks: networks,
  setNetworks: (networks: Network[]) => set({ networks })
}))
