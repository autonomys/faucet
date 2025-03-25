import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const Banner: React.FC = () => {
  return (
    <div className='bg-brand text-white py-3 px-4 text-center font-medium relative dark:bg-box-dark dark:hover:bg-box-darker'>
      <div className='flex items-center justify-center gap-2'>
        <span className='relative flex h-3 w-3 mr-1'>
          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
          <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500'></span>
        </span>
        The Autonomys Network Mainnet - Consensus Chain is LIVE!
        <Link href='https://forum.autonomys.xyz/t/autonomys-mainnet-lifts-off/4566' target='_blank'>
          <button className='cursor-pointer ml-2 h-8 px-3 py-1 text-sm bg-brand-hover hover:bg-brand-secondary text-white rounded border border-brand-hover inline-flex items-center dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover'>
            Learn More
            <ChevronRight className='h-4 w-4 ml-1' />
          </button>
        </Link>
      </div>
    </div>
  )
}
