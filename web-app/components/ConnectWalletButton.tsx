import { NetworkOptions, useNetworkStore } from '@/store/useStore'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'
import { ConnectConsensusWallet } from './ConnectConsensusWallet'

export const ConnectWalletButton: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const { openConnectModal } = useConnectModal()
  const { network } = useNetworkStore()

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide) return null

  if (network === NetworkOptions.CONSENSUS) {
    return <ConnectConsensusWallet className='text-sm py-1.5 px-3 border border-gray-100 dark:border-brand-hover' />
  }

  return (
    <button
      className='cursor-pointer flex text-sm items-center gap-2 px-3 py-1.5 border text-white border-gray-300 rounded-md shadow-sm bg-brand hover:bg-brand-hover dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:border-brand-hover'
      onClick={openConnectModal}>
      Connect Wallet
    </button>
  )
}
