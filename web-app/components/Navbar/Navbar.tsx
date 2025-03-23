import { ConnectWallet } from '@/components/ConnectWallet'
import Image from 'next/image'
export const Navbar: React.FC = () => {
  return (
    <header className='container mx-auto py-6 px-4 flex justify-between items-center'>
      <div className='flex items-center gap-3'>
        <div className='p-2'>
          <Image src='logo.svg' alt='Autonomys' className='h-8 w-auto' width={32} height={300} />
        </div>
      </div>
      <div className='relative group'>
        <ConnectWallet />
      </div>
    </header>
  )
}
