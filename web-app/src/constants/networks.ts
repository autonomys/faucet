import { Chain, hardhat, mainnet } from 'wagmi/chains'

export const nova: Chain = {
  id: 1002,
  name: 'Gemini 3g Nova - Subspace Testnet',
  network: 'gemini',
  nativeCurrency: {
    decimals: 18,
    name: 'tSSC',
    symbol: 'tSSC'
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_ENDPOINT || '']
    },
    public: {
      http: [process.env.NEXT_PUBLIC_RPC_ENDPOINT || '']
    }
  },
  blockExplorers: {
    default: {
      name: 'BlockScout',
      url: 'https://blockscout.subspace.network'
    }
  }
}

export const networks: Chain[] = [nova, mainnet, hardhat]
