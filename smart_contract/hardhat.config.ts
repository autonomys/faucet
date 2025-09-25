import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'
import 'hardhat-awesome-cli'
import { HardhatUserConfig } from 'hardhat/config'
import { NetworksUserConfig } from 'hardhat/types'

let networks: NetworksUserConfig = {}

const {
  // Gemini
  RPC_URL_GEMINI,
  PRIVATE_KEY_GEMINI,
  GEMINI_SCAN_API_KEY,
  // Chronos
  RPC_URL_CHRONOS,
  PRIVATE_KEY_CHRONOS,
  CHRONOS_SCAN_API_KEY,
  // Goerli
  RPC_URL_GOERLI,
  PRIVATE_KEY_GOERLI,
  ETHERSCAN_API_KEY,
} = process.env

if (RPC_URL_GEMINI && PRIVATE_KEY_GEMINI) {
  networks.gemini = {
    url: RPC_URL_GEMINI,
    chainId: 1177,
    accounts: [PRIVATE_KEY_GEMINI],
  }
}

if (RPC_URL_CHRONOS && PRIVATE_KEY_CHRONOS) {
  networks.chronos = {
    url: RPC_URL_CHRONOS,
    chainId: 8700,
    accounts: [PRIVATE_KEY_CHRONOS],
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
      gemini: `${GEMINI_SCAN_API_KEY}`,
      chronos: `${CHRONOS_SCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
    },
    customChains: [
      {
        network: 'gemini',
        chainId: 1177, // Update this to the correct Gemini chain ID
        urls: {
          apiURL: 'https://blockscout.gemini.autonomys.xyz/api',
          browserURL: 'https://blockscout.gemini.autonomys.xyz/',
        },
      },
      {
        network: 'chronos',
        chainId: 8700,
        urls: {
          apiURL: 'https://blockscout.chronos.autonomys.xyz/api',
          browserURL: 'https://blockscout.chronos.autonomys.xyz/',
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
