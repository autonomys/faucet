import { CopyIcon } from '@chakra-ui/icons'
import {
  Box,
  Center,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { BsCheck } from 'react-icons/bs'

interface ReadOnlyInputProps {
  label: string
  value: string
}

export const ReadOnlyInput: React.FC<ReadOnlyInputProps> = ({ label, value }) => {
  const [isCopied, setIsCopied] = useState(false)

  const toast = useToast()
  const handleCopyToClipboard = useCallback(
    (value: string) => {
      navigator.clipboard.writeText(value)
      setIsCopied(true)
      toast({
        status: 'success',
        isClosable: true,
        render: () => (
          <Box color='white' p={3} bg='brand.500' w='50vh'>
            <Center>
              <VStack>
                <Text color='white'>&apos;{value}&apos; copied to clipboard</Text>
              </VStack>
            </Center>
          </Box>
        )
      })
      setTimeout(() => setIsCopied(false), 2000)
    },
    [toast]
  )

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <InputGroup size='md'>
        <Input defaultValue={value} isReadOnly />
        <InputRightElement pr={0}>
          <IconButton
            variant='outline'
            colorScheme='brand'
            aria-label='Copy'
            icon={isCopied ? <BsCheck color='brand.500' size='20' /> : <CopyIcon />}
            onClick={() => handleCopyToClipboard(value)}
          />
        </InputRightElement>
      </InputGroup>
    </FormControl>
  )
}
