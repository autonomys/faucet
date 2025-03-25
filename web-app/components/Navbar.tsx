import { ConnectWallet } from '@/components/ConnectWallet'
import { LogoIcon } from './LogoIcon'
export const Navbar: React.FC = () => {
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
      <div className='relative group'>
        <ConnectWallet />
      </div>
    </header>
  )
}
