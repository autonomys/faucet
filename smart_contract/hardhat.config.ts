import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'
import 'hardhat-awesome-cli'
import { HardhatUserConfig } from 'hardhat/config'
import { NetworksUserConfig } from 'hardhat/types'

let networks: NetworksUserConfig = {}

const {
  // Nova
  RPC_URL_NOVA,
  PRIVATE_KEY_NOVA,
  NOVA_SCAN_API_KEY,
  // Gemini 3
  RPC_URL_GEMINI,
  PRIVATE_KEY_GEMINI,
  GEMINI_SCAN_API_KEY,
  // Goerli
  RPC_URL_GOERLI,
  PRIVATE_KEY_GOERLI,
  ETHERSCAN_API_KEY,
} = process.env

if (RPC_URL_NOVA && PRIVATE_KEY_NOVA) {
  networks.nova = {
    url: RPC_URL_NOVA,
    chainId: 1002,
    accounts: [PRIVATE_KEY_NOVA],
  }
}

if (RPC_URL_GEMINI && PRIVATE_KEY_GEMINI) {
  networks.gemini = {
    url: RPC_URL_GEMINI,
    chainId: 1002,
    accounts: [PRIVATE_KEY_GEMINI],
  }
}

if (RPC_URL_GOERLI && PRIVATE_KEY_GOERLI) {
  networks.goerli = {
    url: RPC_URL_GOERLI,
    accounts: [PRIVATE_KEY_GOERLI],
  }
}

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks,
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  etherscan: {
    apiKey: {
      nova: `${NOVA_SCAN_API_KEY}`,
      gemini: `${GEMINI_SCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
    },
    customChains: [
      {
        network: 'nova',
        chainId: 1002,
        urls: {
          apiURL: 'https://blockscout.subspace.network/api',
          browserURL: 'https://blockscout.subspace.network/',
        },
      },
      {
        network: 'gemini',
        chainId: 1002,
        urls: {
          apiURL: 'https://blockscout.subspace.network/api',
          browserURL: 'https://blockscout.subspace.network/',
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 240000,
  },
}

export default config
