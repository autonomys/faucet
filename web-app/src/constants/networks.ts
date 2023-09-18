import { Chain, hardhat, mainnet } from 'wagmi/chains'

const gemini: Chain = {
  id: 1002,
  name: 'Gemini - Subspace Testnet',
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

export const networks: Chain[] = [gemini, mainnet, hardhat]
