'use client'

import { Web3Provider } from '@/components/web3Provider'
import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0}>
      <Web3Provider>{children}</Web3Provider>
    </SessionProvider>
  )
}
