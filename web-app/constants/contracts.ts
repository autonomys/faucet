import { Abi } from 'viem'

export type Contract = {
  chainId: number
  name: string
  address: `0x${string}`
  abi: Abi
}

const FAUCET: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      }
    ],
    name: 'requestTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      }
    ],
    name: 'nextAccessTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'withdrawalAmount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lockTime',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

const ENV_CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID
const ENV_FAUCET_ADDRESS = process.env.NEXT_PUBLIC_FAUCET_ADDRESS

const PARSED_CHAIN_ID = Number(ENV_CHAIN_ID)

if (!ENV_CHAIN_ID || Number.isNaN(PARSED_CHAIN_ID)) {
  throw new Error('Environment variable NEXT_PUBLIC_CHAIN_ID must be set to a valid number')
}

if (!ENV_FAUCET_ADDRESS) {
  throw new Error('Environment variable NEXT_PUBLIC_FAUCET_ADDRESS must be set to a valid address')
}

export const contracts: Contract[] = [
  {
    chainId: PARSED_CHAIN_ID,
    name: 'Faucet',
    address: ENV_FAUCET_ADDRESS as `0x${string}`,
    abi: FAUCET
  }
]
