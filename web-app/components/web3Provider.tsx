import { evmNetworks } from '@/constants/networks'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'

interface Web3ProviderProps {
  children: React.ReactNode
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const { chains, publicClient } = configureChains(evmNetworks, [publicProvider()])

  const { connectors } = getDefaultWallets({
    appName: 'Autonomys Faucet',
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? 'project-id',
    chains
  })

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  )
}
