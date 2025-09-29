// constants/serverNetworks.ts
export const autoEVM = {
  id: Number(process.env.NEXT_PUBLIC_FAUCET_CHAIN_ID || 0),
  name: 'Auto-EVM Testnet',
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
      name: 'Block Explorer',
      url: process.env.NEXT_PUBLIC_EXPLORER_URL || ''
    }
  }
}

// Optionally, add more server-safe networks if needed
export const evmNetworks = [autoEVM]
