import { NetworkOptions, useNetworkStore } from '@/store/useStore'
import Link from 'next/link'

export const Header: React.FC = () => {
  const { network } = useNetworkStore()
  const networkText = 'Auto-EVM'

  return (
    <div className='mb-10 text-center'>
      <h2 className='text-4xl font-bold mb-4'>Faucet</h2>
      <p className='text-lg text-muted-foreground mb-2 dark:text-gray-400'>
        Get testnet tokens for building applications on the Autonomys Network.
      </p>
      <Link href='https://docs.autonomys.network/mainnet/overview' target='_blank'>
        <span className='inline-flex items-center rounded-full border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm font-medium cursor-pointer'>
          {networkText} Testnet
        </span>
      </Link>
    </div>
  )
}
