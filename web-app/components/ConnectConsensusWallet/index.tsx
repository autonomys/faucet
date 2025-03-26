'use client'

import { cn } from '@/utils/cn'
import React, { useCallback, useState } from 'react'
import { PreferredExtensionModal } from './PreferredExtensionModal'

type ConnectConsensusWalletProps = {
  className?: string
}

export const ConnectConsensusWallet: React.FC<ConnectConsensusWalletProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setIsOpen(true)
  }, [])
  const onClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <button
        onClick={onClick}
        className={cn(
          'bg-brand hover:bg-brand-hover text-white px-4 py-2 rounded-md cursor-pointer dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover',
          className
        )}>
        Connect Wallet
      </button>
      <PreferredExtensionModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}
