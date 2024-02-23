import { Chain, hardhat, mainnet } from 'wagmi/chains'

export const nova: Chain = {
  id: 490000,
  name: 'Nova - Testnet Subspace',
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
      url: 'https://nova.gemini-3h.subspace.network'
    }
  }
}

export const networks: Chain[] = [nova, mainnet, hardhat]
