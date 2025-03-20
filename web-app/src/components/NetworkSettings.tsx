import { Text } from '@chakra-ui/react'
import { nova } from '../constants/networks'
import { ReadOnlyInput } from './ReadOnlyInput'

export const NetworkSettings: React.FC = () => {
  return (
    <>
      <Text size='lg' fontWeight='800' fontSize='1.4rem' pb='4'>
        Network Settings
      </Text>
      <ReadOnlyInput label='Network Name' value={nova.name} />
      <ReadOnlyInput label='RPC URL' value={nova.rpcUrls.default.http[0]} />
      <ReadOnlyInput label='Chain Id' value={nova.id.toString()} />
      <ReadOnlyInput label='Currency symbol' value={nova.nativeCurrency.symbol} />
      <ReadOnlyInput label='Block explorer URL' value={nova.blockExplorers?.default.url ?? ''} />
    </>
  )
}
