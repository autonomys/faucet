import { Heading, HStack, Image, Link, Spacer, Text, VStack } from '@chakra-ui/react'
import { nova } from '../constants/networks'
import { ConnectWallet } from './layout'

export const Header: React.FC = () => {
  return (
    <>
      <HStack w={['100%', '70%', '60%']} h='10vh' display='flex' flexDir='row' align='center'>
        <Link href='/'>
          <Image src='/logo.svg' alt='Autonomys Network Logo' w={[20, 36, 60]} h='8vh' />
        </Link>
        <Spacer />
        <ConnectWallet />
      </HStack>
      <VStack
        align='start'
        spacing={1}
        w={['100%', '70%', '60%']}
        h='10vh'
        display='flex'
        flexDir='column'
        marginBottom={['10px', '20px', '30px']}
        marginTop={['10px']}>
        <Heading size={['md', 'lg', 'xl']} whiteSpace='nowrap'>
          Faucet
        </Heading>
        <Text>Get free testnet tokens for building applications on the Autonomys Network.</Text>
        <Text fontWeight={[400, 500, 600]}>{nova.name}</Text>
      </VStack>
    </>
  )
}
