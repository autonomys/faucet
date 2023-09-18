import { AbsoluteCenter, Box, Button, Center, HStack, Heading, Image, Spacer, Text, VStack } from '@chakra-ui/react'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useAccount, useEnsName, useNetwork, useSwitchNetwork } from 'wagmi'

interface LayoutProps {
  children: React.ReactNode
}

export const ConnectWallet: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const { openConnectModal } = useConnectModal()
  const { openAccountModal } = useAccountModal()

  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    if (isConnected && chain && chain.id !== 31337 && switchNetwork) switchNetwork(31337)
  }, [isConnected, chain, switchNetwork])

  if (!clientSide) return null

  if (isConnected)
    return (
      <Button colorScheme='brand' size='lg' onClick={openAccountModal}>
        {ensName != null ? (
          ensName
        ) : (
          <>
            {address?.slice(0, 6)}...{address?.slice(-6)}
          </>
        )}
      </Button>
    )
  return (
    <Button colorScheme='brand' size='lg' onClick={openConnectModal}>
      Connect Wallet
    </Button>
  )
}

export const Header: React.FC = () => {
  return (
    <HStack w='50vw' h='10vh' display='flex' flexDir='row'>
      <Link href='/'>
        <Image src='/logo.svg' alt='Subspace Network Logo' w='20vw' h='8vh' />
      </Link>
      <Spacer />
      <Box position='relative' w='12vw'>
        <AbsoluteCenter axis='both'>
          <Heading size='xl' whiteSpace='nowrap'>
            Faucet
          </Heading>
        </AbsoluteCenter>
      </Box>
      <Spacer />
      <Box position='relative' h='10vh' verticalAlign='center' pr='2vw'>
        <AbsoluteCenter axis='vertical'>
          <ConnectWallet />
        </AbsoluteCenter>
      </Box>
    </HStack>
  )
}

export const Footer: React.FC = () => {
  return <Box> </Box>
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Link href='https://forum.subspace.network/t/incentivized-testnet-launch-announcement/1713'>
        <Box position='relative' w='100%' h='4vh' bg='brand.500' _hover={{ bg: 'brand.600' }}>
          <AbsoluteCenter axis='both'>
            <Text fontSize='1rem' color='white'>
              The Gemini Incentivized Testnet is LIVE!
            </Text>
          </AbsoluteCenter>
        </Box>
      </Link>
      <Center>
        <VStack h='100%' p={1} pt={4} display='flex' flexDir='column'>
          <Header />
          {children}
          <Footer />
        </VStack>
      </Center>
    </Box>
  )
}
