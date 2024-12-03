import '@nomicfoundation/hardhat-toolbox'
import 'dotenv/config'
import 'hardhat-awesome-cli'
import { HardhatUserConfig } from 'hardhat/config'
import { NetworksUserConfig } from 'hardhat/types'

let networks: NetworksUserConfig = {}

const {
  // Taurus
  RPC_URL_TAURUS,
  PRIVATE_KEY_TAURUS,
  TAURUS_SCAN_API_KEY,
  // Goerli
  RPC_URL_GOERLI,
  PRIVATE_KEY_GOERLI,
  ETHERSCAN_API_KEY,
} = process.env

if (RPC_URL_TAURUS && PRIVATE_KEY_TAURUS) {
  networks.taurus = {
    url: RPC_URL_TAURUS,
    chainId: 490000,
    accounts: [PRIVATE_KEY_TAURUS],
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
      taurus: `${TAURUS_SCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
    },
    customChains: [
      {
        network: 'taurus',
        chainId: 490000,
        urls: {
          apiURL: 'https://auto-evm.taurus.subspace.network/api',
          browserURL: 'https://auto-evm.taurus.subspace.network/',
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
