import { NetworkOptions, useNetworkStore } from '@/store/useStore'
import React from 'react'
import { formatUnits } from 'viem'

interface TokenRequestedProps {
  withdrawalAmount: bigint
  chain: {
    nativeCurrency: { symbol: string }
    blockExplorers?: { default: { url: string } }
  }
  res: {
    txResponse: { hash: string }
  }
}

export const TokenRequested: React.FC<TokenRequestedProps> = ({ withdrawalAmount, chain, res }) => {
  const { network } = useNetworkStore()

  const AstralExplorerUrl = 'https://explorer.autonomys.xyz/taurus/consensus/extrinsics'

  return (
    <div className='bg-brand-500 text-white px-4 py-2 w-[40vh]'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <h2 className='text-lg font-medium'>Token requested</h2>
          <p>
            We&apos;ve requested {formatUnits(withdrawalAmount, 18)} {chain.nativeCurrency.symbol} for you.
          </p>
          {network === NetworkOptions.AUTO_EVM ? (
            <a
              href={`${chain.blockExplorers?.default.url}/tx/${res.txResponse.hash}`}
              target='_blank'
              rel='noopener noreferrer'>
              <button className='border border-white text-white text-sm px-3 py-1 rounded hover:bg-brand-success-hover cursor-pointer'>
                View on Subspace Explorer
              </button>
            </a>
          ) : (
            <a
              href={`${AstralExplorerUrl}/${res.txResponse.hash.toString()}`}
              target='_blank'
              rel='noopener noreferrer'>
              <button className='border border-white text-white text-sm px-3 py-1 rounded hover:bg-brand-success-hover cursor-pointer'>
                View on Autonomys Astral Explorer
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
