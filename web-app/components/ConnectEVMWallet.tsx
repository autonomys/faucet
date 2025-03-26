'use client'

import { autoEVM } from '@/constants/networks'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAccount, useEnsName, useNetwork, useSwitchNetwork } from 'wagmi'

export const ConnectEVMWallet: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)

  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    if (isConnected && chain && chain.id !== autoEVM.id && switchNetwork) switchNetwork(autoEVM.id)
  }, [isConnected, chain, switchNetwork])

  const copyToClipboard = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!clientSide) return null

  if (isConnected)
    return (
      <div className='relative group flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-md dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover'>
        <button onClick={openAccountModal} className='flex items-center gap-1 cursor-pointer'>
          {ensName != null ? (
            ensName
          ) : (
            <>
              {address?.slice(0, 6)}...{address?.slice(-6)}
            </>
          )}
        </button>

        {/* Copy Button */}
        <div className='relative'>
          <button
            onClick={copyToClipboard}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
            className='p-1 hover:bg-white/10 rounded-md cursor-pointer'>
            {copied ? <Check className='w-4 h-4 text-green-400' /> : <Copy className='w-4 h-4' />}
          </button>

          {/* Tooltip */}
          {tooltipVisible && (
            <div className='absolute top-full right-0 mt-2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10'>
              {copied ? 'Copied!' : 'Copy address'}
              <div className='absolute top-0 right-2 transform -translate-y-full border-4 border-transparent border-b-black'></div>
            </div>
          )}
        </div>
      </div>
    )

  return (
    <button
      className='bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-md cursor-pointer dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover'
      onClick={openConnectModal}>
      Connect Wallet
    </button>
  )
}
