import { ConnectWalletButton } from '@/components/ConnectWallet'
import { RequestTokenButton } from '@/components/RequestTokenButton'
import { Web2SocialButton } from '@/components/Web2SocialButton'
import { Contract } from '@/constants/contracts'
import { Check, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { RxDiscordLogo } from 'react-icons/rx'

interface DiscordProps {
  isConnected: boolean
  isDiscordGuildMember: boolean
  contract?: Contract
  address?: string
  setActiveTab: (tab: string) => void
}

export const Discord: React.FC<DiscordProps> = ({
  isConnected,
  isDiscordGuildMember,
  contract,
  address,
  setActiveTab
}) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-xl font-semibold mb-4'>Request token via Discord</h3>
      <ol className='space-y-5'>
        <li className='flex items-start gap-4'>
          <div className='flex-1 pt-1'>
            <div className='flex flex-col gap-2'>
              <p className='font-medium'>By requesting tokens, you are agreeing to the terms and conditions</p>
              <button
                className='text-brand hover:text-brand-hover text-sm flex items-center cursor-pointer'
                onClick={() => setActiveTab('terms')}>
                View Terms and Conditions
                <ExternalLink className='h-3 w-3 ml-1' />
              </button>
            </div>
          </div>
        </li>
        <li className='flex items-start gap-4'>
          <div className='my-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white'>
            {isConnected ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <span className='text-sm font-medium'>1</span>
            )}
          </div>
          <div className='flex-1 pt-1'>
            <div className='flex items-center justify-between'>
              <p className='font-medium my-auto'>Connect your wallet</p>
              {!isConnected && <ConnectWalletButton />}
            </div>
          </div>
        </li>

        <li className='flex items-start gap-4'>
          <div className='my-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white'>
            {isConnected && isDiscordGuildMember ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <span className='text-sm font-medium'>2</span>
            )}
          </div>
          <div className='flex-1 pt-1'>
            <div className='flex items-center justify-between'>
              <p className='font-medium'>Join Autonomys Discord server</p>
              {isConnected && !isDiscordGuildMember && process.env.NEXT_PUBLIC_DISCORD_INVITE_URL && (
                <Link href={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL} target='_blank'>
                  <button className='cursor-pointer px-3 py-1 text-sm border border-gray-300 bg-white hover:bg-gray-50 rounded inline-flex items-center'>
                    <RxDiscordLogo className='h-4 w-4 mr-2' />
                    Join Discord
                  </button>
                </Link>
              )}
            </div>
          </div>
        </li>

        <li className='flex items-start gap-4'>
          <div className='my-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white'>
            {isConnected && isDiscordGuildMember ? (
              <Check className='h-4 w-4 text-green-500' />
            ) : (
              <span className='text-sm font-medium'>3</span>
            )}
          </div>
          <div className='flex-1 pt-1'>
            <div className='flex items-center justify-between'>
              <p className='font-medium'>Connect your Discord account</p>
              {isConnected && !isDiscordGuildMember && <Web2SocialButton provider='discord' />}
            </div>
          </div>
        </li>

        <li className='flex items-start gap-4'>
          <div className='my-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white'>
            <span className='text-sm font-medium'>4</span>
          </div>
          <div className='flex-1 pt-1'>
            <div className='flex items-center justify-between'>
              <p className='font-medium'>Request token with the Faucet bot on Discord or here</p>
              {contract && address && <RequestTokenButton contract={contract} address={address} />}
            </div>
          </div>
        </li>
      </ol>
    </div>
  )
}
