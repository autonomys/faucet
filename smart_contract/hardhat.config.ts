import { HardhatUserConfig } from 'hardhat/config'
import { NetworksUserConfig } from 'hardhat/types'
import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'
import 'hardhat-awesome-cli'

let networks: NetworksUserConfig = {}

const {
  // Gemini 3
  RPC_URL_GEMINI,
  PRIVATE_KEY_GEMINI,
  GEMINI_SCAN_API_KEY,
  // Goerli
  RPC_URL_GOERLI,
  PRIVATE_KEY_GOERLI,
  ETHERSCAN_API_KEY,
} = process.env

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
      gemini: `${GEMINI_SCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
    },
    customChains: [
      {
        network: 'gemini',
        chainId: 0, // TODO: Update
        urls: {
          apiURL: '', // TODO: Update
          browserURL: '', // TODO: Update
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
