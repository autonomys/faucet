import { ConnectConsensusWallet } from '@/components/ConnectConsensusWallet'
import { ConnectEVMWallet } from '@/components/ConnectEVMWallet'
import useWallet from '@/hooks/useWallet'
import { NetworkOptions, useNetworkStore } from '@/store/useStore'
import { useMemo } from 'react'
import AccountListDropdown from './ConnectConsensusWallet/AccountListDropdown'
import { LogoIcon } from './LogoIcon'
import NetworkDropdown from './NetworkDropdown'

export const Navbar: React.FC = () => {
  const { network } = useNetworkStore()
  const { actingAccount } = useWallet()

  const walletsButton = useMemo(() => {
    if (network === NetworkOptions.AUTO_EVM) {
      return <ConnectEVMWallet />
    }
    if (actingAccount) {
      return <AccountListDropdown />
    }
    return <ConnectConsensusWallet />
  }, [network, actingAccount])

  return (
    <header className='container mx-auto py-6 px-4 flex justify-between items-center'>
      <div className='flex items-center gap-3'>
        <div className='p-2'>
          <LogoIcon
            className='w-auto h-8'
            iconTextClassName='fill-[#181826] dark:fill-white'
            iconClassName='fill-[#5672b7] dark:fill-white'
          />
        </div>
      </div>
      <div className='flex flex-row gap-3'>
        <NetworkDropdown
          options={[
            { label: 'Auto-EVM - Taurus', value: NetworkOptions.AUTO_EVM },
            { label: 'Consensus - Taurus', value: NetworkOptions.CONSENSUS }
          ]}
          onSelect={() => {}}
        />
        {walletsButton}
      </div>
    </header>
  )
}
