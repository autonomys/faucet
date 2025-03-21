// app/layout.tsx
import Providers from './Providers'

export const metadata = {
  title: 'Autonomys Faucet',
  description: 'Get your testnet tokens instantly'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
