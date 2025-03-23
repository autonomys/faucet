import Providers from '@/app/providers'
import '@rainbow-me/rainbowkit/styles.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Autonomys Testnet Faucet',
  description:
    'Autonomys Testnet Faucet - Get testnet tokens for the Autonomys Network. Autonomys is a fourth generation blockchain built for the next wave of crypto creators',
  keywords: ['autonomys', 'subspace', 'faucet', 'testnet'],
  authors: [{ name: 'Autonomys Network', url: 'https://autonomysfaucet.com' }],
  creator: 'Autonomys Network',
  publisher: 'Autonomys Network',
  applicationName: 'Autonomys Testnet Faucet',
  metadataBase: new URL('https://autonomysfaucet.com'),
  openGraph: {
    title: 'Autonomys Testnet Faucet',
    description:
      'Autonomys Testnet Faucet - Get testnet tokens for the Autonomys Network. Autonomys is a fourth generation blockchain built for the next wave of crypto creators',
    url: 'https://autonomysfaucet.com',
    siteName: 'Autonomys Testnet Faucet',
    images: ['https://autonomysfaucet.com/images/share.png'],
    type: 'website'
  },
  twitter: {
    card: 'summary',
    title: 'Autonomys Testnet Faucet',
    description: 'Autonomys Testnet Faucet - Get testnet tokens for the Autonomys Network.',
    site: '@AutonomysNet',
    images: ['https://autonomysfaucet.com/images/share.png']
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/logo.svg',
        color: '#000000'
      }
    ]
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        {/* Custom tags for Frames */}
        <meta property='fc:frame' content='vNext' />
        <meta property='fc:frame:image' content='/images/share.png' />
        <meta property='fc:frame:image:aspect_ratio' content='1.91:1' />
        <meta property='fc:frame:post_url' content='https://autonomysfaucet.com/api/requestTokens' />
        <meta property='fc:frame:button:1' content='Request Nova Testnet Token' />
        <meta property='fc:frame:button:1:action' content='post' />
        <meta property='fc:frame:button:1:target' content='https://autonomysfaucet.com/api/requestTokens' />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <ToastContainer
            position='bottom-center'
            autoClose={9000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='colored'
            toastClassName='!w-100'
          />
        </Providers>
      </body>
    </html>
  )
}
