import { Github, Moon, Sun, Twitter } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { RxDiscordLogo } from 'react-icons/rx'

export const Footer: React.FC = () => {
  const { theme, setTheme } = useTheme()

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
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`border rounded-md relative group text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2 cursor-pointer ${
                theme === 'dark' ? 'border-yellow-400' : 'border-background-darker'
              }`}
              aria-label='Toggle Dark Mode'>
              {theme === 'dark' ? (
                <Sun className='h-5 w-5 text-yellow-400 transition-colors duration-200' />
              ) : (
                <Moon className='h-5 w-5 text-background-darker transition-colors duration-200' />
              )}

              {/* Tooltip */}
              <span className='absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity'>
                {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
