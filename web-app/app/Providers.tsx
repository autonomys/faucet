'use client'

import { Layout } from '@/components/layout'
import { Web3Provider } from '@/components/web3Provider'
import theme from '@/styles/theme'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SessionProvider refetchInterval={0}>
        <Web3Provider>
          <Layout>{children}</Layout>
        </Web3Provider>
      </SessionProvider>
    </ChakraProvider>
  )
}
