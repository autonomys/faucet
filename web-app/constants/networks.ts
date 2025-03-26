import { Chain, hardhat, mainnet } from 'wagmi/chains'

export const autoEVM: Chain = {
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

type ConsensusChain = {
  id: string
  name: string
  network: string
  nativeCurrency: {
    decimals: number
    name: string
    symbol: string
  }
  rpcUrls: {
    default: {
      http: string[]
    }
    public: {
      http: string[]
    }
  }
  blockExplorers: {
    default: {
      name: string
      url: string
    }
  }
}

export const consensus: ConsensusChain = {
  id: '-',
  name: 'Consensus - Autonomys Taurus Testnet',
  network: 'consensus-taurus',
  nativeCurrency: {
    decimals: 18,
    name: 'tAI3',
    symbol: 'tAI3'
  },
  rpcUrls: {
    default: {
      http: ['wss://rpc-0.taurus.autonomys.xyz/ws']
    },
    public: {
      http: ['wss://rpc-0.taurus.autonomys.xyz/ws']
    }
  },
  blockExplorers: {
    default: {
      name: 'Autonomys Astral Explorer',
      url: 'https://explorer.autonomys.xyz/taurus/consensus/'
    }
  }
}

export const evmNetworks: Chain[] = [autoEVM, mainnet, hardhat]
export const consensusNetworks: ConsensusChain[] = [consensus]
export const networks: (Chain | ConsensusChain)[] = [...evmNetworks, ...consensusNetworks]
