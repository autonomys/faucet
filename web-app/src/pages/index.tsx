import { Card, Heading, Tab, TabList, TabPanel, TabPanels, Tabs, useColorMode, useMediaQuery } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import React, { useEffect, useMemo, useState } from 'react'
import { FaCog, FaDiscord, FaGithub, FaRegFileAlt } from 'react-icons/fa'
import { useAccount, useNetwork } from 'wagmi'
import { Discord } from '../components/Discord'
import { GitHub } from '../components/GitHub'
import { NetworkSettings } from '../components/NetworkSettings'
import { TermsAndConditions } from '../components/TermsAndConditions'
import { contracts } from '../constants/contracts'

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
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)', { ssr: true, fallback: false })

  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    if (colorMode === 'dark') toggleColorMode()
  }, [colorMode, toggleColorMode])

  if (!clientSide) return null

  return (
    <Card minW='60vw' maxW={['100vw', '70vw', '50vw']} mt={[2, 6, 10]} p={[0, 2, 4]}>
      <Heading p={['0', '2', '4']}>How to get Testnet token</Heading>
      <Tabs>
        <TabList pt={['0', '2', '4']}>
          <Tab>
            <FaGithub size='20' />
            {isLargerThan800 && (
              <Heading size='md' pl='4'>
                GitHub
              </Heading>
            )}
          </Tab>
          <Tab>
            <FaDiscord size='20' />
            {isLargerThan800 && (
              <Heading size='md' pl='4'>
                Discord
              </Heading>
            )}
          </Tab>
          <Tab>
            <FaCog size='20' />
            {isLargerThan800 && (
              <Heading size='md' pl='4'>
                Network Settings
              </Heading>
            )}
          </Tab>
          <Tab>
            <FaRegFileAlt size='20' />
            {isLargerThan800 && (
              <Heading size='md' pl='4'>
                Terms and Conditions
              </Heading>
            )}
          </Tab>
        </TabList>
        <TabPanels p='4'>
          <TabPanel>
            <GitHub
              isConnected={isConnected}
              isGitHubFollower={isGitHubFollower}
              contract={contract}
              address={address}
            />
          </TabPanel>
          <TabPanel>
            <Discord
              isConnected={isConnected}
              isDiscordGuildMember={isDiscordGuildMember}
              contract={contract}
              address={address}
            />
          </TabPanel>
          <TabPanel>
            <NetworkSettings />
          </TabPanel>
          <TabPanel>
            <TermsAndConditions />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Autonomys Faucet' } }
}

export default Page
