import { ColorModeScript } from '@chakra-ui/color-mode'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import React from 'react'
import { Layout } from '../components/layout'
import { Web3Provider } from '../components/web3Provider'
import Header from '../config'
import theme from '../styles/theme'

const App: React.FC<AppProps> = ({ Component, pageProps = { title: 'Subspace Faucet' } }) => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header title={pageProps.title} />
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <Web3Provider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Web3Provider>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default App
