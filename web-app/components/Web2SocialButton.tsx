import { Button } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'

interface Web2SocialButtonProps {
  provider: string
}

export const Web2SocialButton: React.FC<Web2SocialButtonProps> = ({ provider }) => (
  <Button variant='outline' colorScheme='brand' ml='2' size='sm' onClick={async () => await signIn(provider)}>
    Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
  </Button>
)
