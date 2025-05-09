import { Discord } from '@/components/Discord'
import { GitHub } from '@/components/GitHub'
import { NetworkSettings } from '@/components/NetworkSettings'
import { Terms } from '@/components/Terms'
import { contracts } from '@/constants/contracts'
import useWallet from '@/hooks/useWallet'
import { NetworkOptions, useNetworkStore } from '@/store/useStore'
import { FileText, Github, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { RxDiscordLogo } from 'react-icons/rx'
import { useAccount, useNetwork } from 'wagmi'

export const TokenCard: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { data: session } = useSession()
  const { network, activeTab, setActiveTab } = useNetworkStore()
  const { actingAccount } = useWallet()

  const contract = useMemo(() => {
    if (chain && network === NetworkOptions.AUTO_EVM) {
      return contracts.find((c) => c.name === 'Faucet' && c.chainId === chain.id)
    }
    return undefined
  }, [chain, network])

  const isGitHubFollower = useMemo(
    () => !!(session && session.user != null && session.user.isGitHubFollower),
    [session]
  )
  const isDiscordGuildMember = useMemo(
    () => !!(session && session.user != null && session.user.isDiscordGuildMember),
    [session]
  )

  const tabs = [
    { id: 'github', label: 'GitHub', icon: <Github className='h-4 w-4' /> },
    {
      id: 'discord',
      label: 'Discord',
      icon: <RxDiscordLogo className='h-4 w-4' />
    },
    {
      id: 'settings',
      label: 'Network Settings',
      icon: <Settings className='h-4 w-4' />
    },
    { id: 'terms', label: 'Terms', icon: <FileText className='h-4 w-4' /> }
  ]

  useEffect(() => {
    setClientSide(true)
  }, [])

  const isWalletConnected = useMemo<boolean>(() => {
    if (actingAccount && network === NetworkOptions.CONSENSUS) {
      return true
    }
    if (isConnected && network === NetworkOptions.AUTO_EVM) {
      return true
    }
    return false
  }, [isConnected, actingAccount, network])

  const currentWalletAddress = useMemo(() => {
    if (actingAccount && network === NetworkOptions.CONSENSUS) {
      return actingAccount.address
    }
    if (isConnected && network === NetworkOptions.AUTO_EVM) {
      return address
    }
    return ''
  }, [actingAccount, network, address, isConnected])

  if (!clientSide) return null

  return (
    <div className='bg-box-light dark:bg-box-dark rounded-xl shadow-lg border border-gray-light overflow-hidden dark:border-box-dark'>
      <div className='p-6 pb-4'>
        <h3 className='font-semibold tracking-tight text-2xl'>How to get Testnet token</h3>
      </div>

      {/* Tabs */}
      <div className='px-6'>
        <div className='items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid grid-cols-4 mb-6'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`cursor-pointer flex justify-center items-center gap-2 px-4 py-1.5 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-gray-900 bg-white rounded-sm dark:bg-box-dark dark:text-gray-100'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.icon}
              <span className='hidden sm:inline'>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='px-6 pb-6'>
        {/* GitHub Tab Content */}
        {activeTab === 'github' && (
          <GitHub
            isConnected={isWalletConnected}
            isGitHubFollower={isGitHubFollower}
            contract={contract}
            address={currentWalletAddress ?? undefined}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Discord Tab Content */}
        {activeTab === 'discord' && (
          <Discord
            isConnected={isWalletConnected}
            isDiscordGuildMember={isDiscordGuildMember}
            contract={contract}
            address={currentWalletAddress ?? undefined}
            setActiveTab={setActiveTab}
          />
        )}

        {/* Network Settings Tab Content */}
        {activeTab === 'settings' && <NetworkSettings />}

        {/* Terms Tab Content */}
        {activeTab === 'terms' && <Terms />}
      </div>

      <div className='flex justify-between border-t border-gray-200 p-6'>
        <Link href='https://autonomys.xyz/discord'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>Need help? Contact support</p>
        </Link>
        <Link href='https://docs.autonomys.xyz/' target='_blank'>
          <button className='px-3 py-1 text-sm border border-gray-300 bg-white hover:bg-gray-50 rounded cursor-pointer dark:bg-box-dark dark:text-gray-100 dark:hover:bg-box-darker'>
            Documentation
          </button>
        </Link>
      </div>
    </div>
  )
}
