import { Github, Twitter } from 'lucide-react'
import Link from 'next/link'
import { RxDiscordLogo } from 'react-icons/rx'

export const Footer: React.FC = () => {
  return (
    <footer className='container mx-auto px-4 py-8 mt-12'>
      <div className='max-w-3xl mx-auto'>
        <div className='border-t border-gray-200 dark:border-gray-800 mb-6'></div>
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className='text-sm text-gray-500 dark:text-gray-400'>© 2025 Autonomys Network. All rights reserved.</p>
          <div className='flex items-center gap-4'>
            <Link href='https://github.com/autonomys' target='_blank'>
              <button className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 cursor-pointer'>
                <Github className='h-5 w-5 text-current' aria-hidden='true' />
              </button>
            </Link>
            <Link href='https://autonomys.xyz/discord' target='_blank'>
              <button className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 cursor-pointer'>
                <RxDiscordLogo className='h-5 w-5 text-current' aria-hidden='true' />
              </button>
            </Link>
            <Link href='https://x.com/AutonomysNet' target='_blank'>
              <button className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 cursor-pointer'>
                <Twitter className='h-5 w-5 text-current' aria-hidden='true' />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
