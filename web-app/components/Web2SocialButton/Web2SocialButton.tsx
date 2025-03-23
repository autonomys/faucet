import { Github } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { RxDiscordLogo } from 'react-icons/rx'

interface Web2SocialButtonProps {
  provider: string
}

const getIcon = (provider: string) => {
  switch (provider) {
    case 'github':
      return <Github className='w-4 h-4 mr-2' />
    case 'discord':
      return <RxDiscordLogo className='w-4 h-4 mr-2' />
    default:
      return ''
  }
}

export const Web2SocialButton: React.FC<Web2SocialButtonProps> = ({ provider }) => (
  <button
    className='cursor-pointer px-3 py-1 text-sm border border-gray-300 bg-white hover:bg-gray-50 rounded inline-flex items-center'
    onClick={async () => await signIn(provider)}>
    {getIcon(provider)}
    Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
  </button>
)
