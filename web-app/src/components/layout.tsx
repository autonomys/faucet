import { AbsoluteCenter, Box, Button, Center, HStack, Heading, Image, Spacer, Text, VStack } from '@chakra-ui/react'
import { useAccountModal, useConnectModal } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useAccount, useEnsName, useNetwork, useSwitchNetwork } from 'wagmi'
import { nova } from '../constants/networks'

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
    if (isConnected && chain && chain.id !== nova.id && switchNetwork) switchNetwork(nova.id)
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
    <Button colorScheme='brand' size={['sm', 'md', 'lg']} onClick={openConnectModal}>
      Connect Wallet
    </Button>
  )
}

export const Header: React.FC = () => {
  return (
    <HStack w={['100%', '70%', '50%']} h='10vh' display='flex' flexDir='row' m='auto' align='center'>
      <Link href='/'>
        <Image src='/logo.svg' alt='Subspace Network Logo' w={[20, 36, 60]} h='8vh' />
      </Link>
      <Spacer />
      <Heading size={['md', 'lg', 'xl']} whiteSpace='nowrap'>
        Faucet
      </Heading>
      <Text fontWeight={[400, 500, 600]}>{nova.name}</Text>
      <Spacer />
      <ConnectWallet />
      <Spacer />
    </HStack>
  )
}

export const Footer: React.FC = () => {
  return <Box> </Box>
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Link href='https://forum.autonomys.xyz/t/autonomys-mainnet-lifts-off/4566'>
        <Box position='relative' w='100%' h='4vh' bg='brand.500' _hover={{ bg: 'brand.600' }}>
          <AbsoluteCenter axis='both'>
            <Text fontSize={[10, 14, 16]} color='white'>
              The Autonomys Network Mainnet - Consensus Chain is LIVE!
            </Text>
          </AbsoluteCenter>
        </Box>
      </Link>
      <Center>
        <VStack w='100%' h='100%' display='flex' flexDir='column'>
          <Header />
          {children}
          <Footer />
        </VStack>
      </Center>
    </Box>
  )
}
