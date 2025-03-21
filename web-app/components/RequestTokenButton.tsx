import { Box, Button, Center, Heading, Link, Text, useToast, VStack } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { formatUnits } from 'viem'
import { useContractReads, useNetwork } from 'wagmi'
import { Contract } from '../constants/contracts'
import { formatSeconds } from '../utils'

interface RequestTokenButtonProps {
  contract: Contract
  address: string
}

export const RequestTokenButton: React.FC<RequestTokenButtonProps> = ({ contract, address }) => {
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
      if (session.user.accountType === 'github' && !session.user.isGitHubFollower)
        return toast({
          title: 'Error requesting token',
          description:
            'Please make sure you are following Autonomys GitHub account and connect your GitHub account again.',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      if (session.user.accountType === 'discord' && !session.user.isDiscordGuildMember)
        return toast({
          title: 'Error requesting token',
          description: 'Please make sure you are member of the Discord server and connect your Discord account again.',
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      setIsLoading(true)
      const withdrawalAmount = data[0].status === 'success' ? (data[0].result as bigint) : BigInt(0)
      const nextAccessTime = data[1].status === 'success' ? (data[1].result as bigint) : BigInt(0)
      const now = BigInt(Math.floor(Date.now() / 1000))
      switch (true) {
        case now < nextAccessTime:
          toast({
            title: 'Error requesting token',
            description: `You can request token again in ${formatSeconds(
              Number(BigInt(nextAccessTime) - BigInt(now))
            )}.`,
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
                            We&apos;ve requested {formatUnits(withdrawalAmount, 18)} {chain.nativeCurrency.symbol} for
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
        description:
          "We couldn't request token for you. Make sure you are on Autonomys Auto-EVM network and try again.",
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
