import { Chain, hardhat, mainnet } from 'wagmi/chains'

export const nova: Chain = {
  id: 490000,
  name: 'Auto-EVM - Autonomys Taurus Testnet',
  network: 'auto-evm-taurus',
  nativeCurrency: {
    decimals: 18,
    name: 'tAI3',
    symbol: 'tAI3'
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_ENDPOINT || '']
    },
    public: {
      http: [process.env.NEXT_PUBLIC_RPC_ENDPOINT || '']
    }
  }
  // blockExplorers: {
  //   default: {
  //     name: 'Nova Explorer',
  //     url: 'https://nova.subspace.network'
  //   }
  // }
}

export const networks: Chain[] = [nova, mainnet, hardhat]
