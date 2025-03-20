import { Button, Link, ListItem, OrderedList, Text } from '@chakra-ui/react'
import { Contract } from '../constants/contracts'
import { Checked } from './Checked'
import { ConnectWalletButton } from './ConnectWalletButton'
import { RequestTokenButton } from './RequestTokenButton'
import { Web2SocialButton } from './Web2SocialButton'

interface DiscordProps {
  isConnected: boolean
  isDiscordGuildMember: boolean
  contract?: Contract
  address?: string
}
export const Discord: React.FC<DiscordProps> = ({ isConnected, isDiscordGuildMember, contract, address }) => {
  return (
    <>
      <Text size='lg' fontWeight='800' fontSize='1.4rem' pb='4'>
        Request token via Discord
      </Text>
      <OrderedList fontWeight='600' fontSize='1.2rem' spacing={4}>
        <ListItem>By requesting tokens, you are agreeing to the terms and conditions</ListItem>
        <ListItem>
          <Checked isChecked={isConnected} />
          Connect your wallet
          {!isConnected && <ConnectWalletButton />}
        </ListItem>
        <ListItem>
          <Checked isChecked={isConnected && isDiscordGuildMember} />
          Join Autonomys Discord server
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
    </>
  )
}
