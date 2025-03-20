import { Box, Button, Link, ListItem, OrderedList, Text } from '@chakra-ui/react'
import { Contract } from '../constants/contracts'
import { Checked } from './Checked'
import { ConnectWalletButton } from './ConnectWalletButton'
import { RequestTokenButton } from './RequestTokenButton'
import { Web2SocialButton } from './Web2SocialButton'
interface GitHubProps {
  isConnected: boolean
  isGitHubFollower: boolean
  contract?: Contract
  address?: string
}

export const GitHub: React.FC<GitHubProps> = ({ isConnected, isGitHubFollower, contract, address }) => {
  return (
    <Box>
      <Text size='lg' fontWeight='800' fontSize='1.4rem' pb='4'>
        Request token via GitHub
      </Text>
      <OrderedList fontWeight='600' fontSize='1.2rem' spacing={4}>
        <ListItem>By requesting tokens, you are agreeing to the terms and conditions</ListItem>
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
                Autonomys GitHub
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
    </Box>
  )
}
