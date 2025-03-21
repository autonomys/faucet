import { Button } from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useEffect, useState } from 'react'

export const ConnectWalletButton: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const { openConnectModal } = useConnectModal()

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide) return null

  return (
    <Button variant='outline' colorScheme='brand' ml='2' size='sm' onClick={openConnectModal}>
      Connect Wallet
    </Button>
  )
}
