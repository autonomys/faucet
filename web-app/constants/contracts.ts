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

const faucetChainId = process.env.NEXT_PUBLIC_FAUCET_CHAIN_ID
const faucetAddress = process.env.NEXT_PUBLIC_FAUCET_ADDRESS as `0x${string}` | undefined

export const contracts: Contract[] =
  faucetChainId && faucetAddress
    ? [
        {
          chainId: Number(faucetChainId),
          name: 'Faucet',
          address: faucetAddress,
          abi: FAUCET
        }
      ]
    : []
