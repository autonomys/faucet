import {
  Box,
  Button,
  Card,
  Center,
  Heading,
  Image,
  ListIcon,
  ListItem,
  OrderedList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useColorMode,
  useToast
} from '@chakra-ui/react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import { BsCheckCircle } from 'react-icons/bs'
import { useAccount, useContractReads, useNetwork } from 'wagmi'
import { Contract, contracts } from '../constants/contracts'

interface CheckedOrNotProps {
  isChecked: boolean
}

interface Web2SocialButtonProps {
  provider: string
}

interface RequestTokenButtonProps {
  contract: Contract
  address: string
}

const ConnectWalletButton: React.FC = () => {
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

const Web2SocialButton: React.FC<Web2SocialButtonProps> = ({ provider }) => (
  <Button variant='outline' colorScheme='brand' ml='2' size='sm' onClick={async () => await signIn(provider)}>
    Sign in with {provider.charAt(0).toUpperCase() + provider.slice(1)}
  </Button>
)

const Checked: React.FC<CheckedOrNotProps> = ({ isChecked }) =>
  isChecked && <ListIcon as={BsCheckCircle} color='brand.500' />

const RequestTokenButton: React.FC<RequestTokenButtonProps> = ({ contract, address }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { data: session } = useSession()
  const { chain } = useNetwork()
  const toast = useToast()

  const { data, isError: dataIsError } = useContractReads({
    contracts: [
      {
        ...contract,
        functionName: 'withdrawalAmount'
      },
      {
        ...contract,
        functionName: 'nextAccessTime',
        args: [address]
      }
    ],
    allowFailure: true,
    watch: false,
    cacheTime: 20_000
  })

  const handleRequestToken = async () => {
    if (chain && !dataIsError && data && data[0] && data[1] && session != null && session.user != null) {
      setIsLoading(true)
      const withdrawalAmount = data[0].result as bigint
      const nextAccessTime = data[1].result as bigint
      const now = BigInt(Math.floor(Date.now() / 1000))
      switch (true) {
        case now < nextAccessTime:
          toast({
            title: 'Error requesting token',
            description: `You can request token again in ${Number(nextAccessTime - now)} seconds.`,
            status: 'error',
            duration: 9000,
            isClosable: true
          })
          setIsError(true)
          setIsLoading(false)
          return
        default:
          return await fetch('/api/requestTokens', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              chainId: chain.id,
              address,
              accountType: session.user.accountType,
              accountId: session.user.id
            })
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res)
              if (res.txResponse != null)
                toast({
                  status: 'success',
                  isClosable: true,
                  render: () => (
                    <Box color='white' p={3} bg='brand.500' w='40vh'>
                      <Center>
                        <VStack>
                          <Heading color='white' size='md'>
                            Token requested
                          </Heading>
                          <Text color='white'>
                            We&apos;ve requested {Number(withdrawalAmount) / 10 ** 18} {chain.nativeCurrency.symbol} for
                            you.
                          </Text>
                          <Link href={`${chain.blockExplorers?.default.url}/tx/${res.txResponse.hash}`} target='_blank'>
                            <Button variant='outline' colorScheme='brand' ml='2' size='sm' color='white'>
                              View on Subspace Explorer
                            </Button>
                          </Link>
                        </VStack>
                      </Center>
                    </Box>
                  )
                })
              else
                toast({
                  title: 'Error requesting token',
                  description: `There was an error in the request, please try again.`,
                  status: 'error',
                  duration: 9000,
                  isClosable: true
                })
              setIsSuccess(true)
            })
            .catch((err) => {
              console.error('Error', err)
              toast({
                title: 'Error requesting token',
                description: "We couldn't request token for you. Please try again.",
                status: 'error',
                duration: 9000,
                isClosable: true
              })
              setIsError(true)
            })
            .finally(() => {
              setIsLoading(false)
            })
      }
    } else
      toast({
        title: 'Error requesting token',
        description: "We couldn't request token for you. Make sure you are on Subspace network and try again.",
        status: 'error',
        duration: 9000,
        isClosable: true
      })
  }

  const reset = () => {
    setIsLoading(false)
    setIsError(false)
    setIsSuccess(false)
  }

  // if (isSuccess) return <Checked isChecked={isSuccess} />

  return (
    <>
      <Button
        variant='outline'
        colorScheme='brand'
        ml='2'
        size='sm'
        isLoading={isLoading}
        isDisabled={isSuccess || isError}
        onClick={async () => await handleRequestToken()}>
        Request token
      </Button>
      {(isLoading || isError || isSuccess) && (
        <Button variant='outline' colorScheme='brand' ml='2' size='sm' onClick={reset}>
          Reset request
        </Button>
      )}
    </>
  )
}

const Page: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const { isConnected, address } = useAccount()
  const { colorMode, toggleColorMode } = useColorMode()
  const { chain } = useNetwork()
  const { data: session } = useSession()

  const contract = useMemo(() => chain && contracts.find((c) => c.name === 'Faucet' && c.chainId === chain.id), [chain])
  const isGitHubFollower = useMemo(
    () => !!(session && session.user != null && session.user.isGitHubFollower),
    [session]
  )
  const isDiscordGuildMember = useMemo(
    () => !!(session && session.user != null && session.user.isDiscordGuildMember),
    [session]
  )

  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    if (colorMode === 'dark') toggleColorMode()
  }, [colorMode, toggleColorMode])

  if (!clientSide) return null

  return (
    <Card minW='60vw' mt='10' p='4'>
      <Heading p='4'>How to get Testnet token</Heading>
      <Tabs>
        <TabList pt='4'>
          <Tab>
            <Image src='/images/github.svg' alt='X' w='10' />
            <Heading size='lg' pl='4'>
              GitHub
            </Heading>
          </Tab>
          <Tab>
            <Image src='/images/discord.svg' alt='X' w='10' />
            <Heading size='lg' pl='4'>
              Discord
            </Heading>
          </Tab>
          {/* <Tab>
            <Image src='/images/x.svg' alt='X' w='8' />
            <Heading size='lg' pl='4'>
              X/Twitter
            </Heading>
          </Tab> */}
        </TabList>
        <TabPanels p='4'>
          <TabPanel>
            <Text size='lg' fontWeight='800' fontSize='1.4rem' pb='4'>
              Request token via GitHub
            </Text>
            <OrderedList fontWeight='600' fontSize='1.2rem' spacing={4}>
              <ListItem>
                <Checked isChecked={isConnected} />
                Connect your wallet
                {!isConnected && <ConnectWalletButton />}
              </ListItem>
              <ListItem>
                <Checked isChecked={isConnected && isGitHubFollower} />
                Follow us on GitHub
                {isConnected && !isGitHubFollower && process.env.NEXT_PUBLIC_GITHUB_ACCOUNT_URL && (
                  <Link href={process.env.NEXT_PUBLIC_GITHUB_ACCOUNT_URL} target='_blank'>
                    <Button variant='outline' colorScheme='brand' ml='2' size='sm'>
                      Subspace GitHub
                    </Button>
                  </Link>
                )}
              </ListItem>
              <ListItem>
                <Checked isChecked={isConnected && isGitHubFollower} />
                Connect your GitHub account
                {isConnected && !isGitHubFollower && <Web2SocialButton provider='github' />}
              </ListItem>
              <ListItem>
                Request token {contract && address && <RequestTokenButton contract={contract} address={address} />}
              </ListItem>
            </OrderedList>
          </TabPanel>
          <TabPanel>
            <Text size='lg' fontWeight='800' fontSize='1.4rem' pb='4'>
              Request token via Discord
            </Text>
            <OrderedList fontWeight='600' fontSize='1.2rem' spacing={4}>
              <ListItem>
                <Checked isChecked={isConnected} />
                Connect your wallet
                {!isConnected && <ConnectWalletButton />}
              </ListItem>
              <ListItem>
                <Checked isChecked={isConnected && isDiscordGuildMember} />
                Join Subspace Discord server
                {process.env.NEXT_PUBLIC_DISCORD_INVITE_URL && (
                  <Link href={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL} target='_blank'>
                    <Button variant='outline' colorScheme='brand' ml='2' size='sm'>
                      Join Discord
                    </Button>
                  </Link>
                )}
              </ListItem>
              <ListItem>
                <Checked isChecked={isConnected && isDiscordGuildMember} />
                Connect your Discord account
                <Web2SocialButton provider='discord' />
              </ListItem>
              <ListItem>
                Request token with the Faucet bot on Discord or here{' '}
                {contract && address && <RequestTokenButton contract={contract} address={address} />}
              </ListItem>
            </OrderedList>
          </TabPanel>
          {/* <TabPanel>
            <Text size='lg' fontWeight='800' fontSize='1.4rem' pb='4'>
              Request token via X/Twitter
            </Text>
            <OrderedList fontWeight='600' fontSize='1.2rem' spacing={4}>
              <ListItem>
                <Checked isChecked={isConnected} />
                Connect your wallet
              </ListItem>
              <ListItem>
                Follow us on X/Twitter
                <Link href='https://twitter.com/NetworkSubspace' target='_blank'>
                  <Button variant='outline' colorScheme='brand' ml='2' size='sm'>
                    Follow us on Twitter
                  </Button>
                </Link>
              </ListItem>
              <ListItem>Post a token request</ListItem>
              <ListItem>
                Connect your X/Twitter account
                <Web2SocialButton provider='twitter' />
              </ListItem>
            </OrderedList>
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Card>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Faucet' } }
}

export default Page
