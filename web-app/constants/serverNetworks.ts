// constants/serverNetworks.ts
export const nova = {
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
  },
  blockExplorers: {
    default: {
      name: 'Autonomys Taurus Blockscout Explorer',
      url: 'https://blockscout.taurus.autonomys.xyz/'
    }
  }
}

// Optionally, add more server-safe networks if needed
export const networks = [nova]
