import { Chain, hardhat, mainnet } from 'wagmi/chains'

export const nova: Chain = {
  id: 490000,
  name: 'Gemini 3h Nova - Subspace Testnet',
  network: 'nova',
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
      name: 'Nova Explorer',
      url: 'https://nova.subspace.network'
    }
  }
}

export const networks: Chain[] = [nova, mainnet, hardhat]
