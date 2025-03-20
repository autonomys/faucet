import { Box, Link, ListItem, Text, UnorderedList, VStack } from '@chakra-ui/react'

export const TermsAndConditions: React.FC = () => {
  return (
    <>
      <VStack align='start' spacing={4} w='100%' mb={6}>
        <Text size='lg' fontWeight='800' fontSize='1.4rem'>
          Terms and Conditions for Autonomys Test Token Faucet
        </Text>
        <Text fontSize='1.1rem' fontWeight='600'>
          By accessing or using the Faucet, you agree to be bound by these terms and conditions.
        </Text>
        <Text fontSize='1rem' color='gray.600'>
          Last Updated: October 26, 2023
        </Text>
        <Text fontSize='1.1rem'>
          These Terms and Conditions (&quot;Agreement&quot;) govern your use of the Autonomys Faucet
          (&quot;Faucet&quot;) provided by{' '}
          <Link color='#5870B3' href='https://autonomys.xyz/' target='_blank'>
            Autonomys Labs (&quot;Provider&quot;)
          </Link>
        </Text>
        <Text fontSize='1.1rem' fontWeight='600' fontStyle='italic'>
          If you do not agree to these terms, please refrain from using the Faucet.
        </Text>
      </VStack>
      <UnorderedList spacing={4} styleType='none'>
        <ListItem fontWeight='600' fontSize='1.1rem'>
          1. Use of the Faucet
        </ListItem>
        <ListItem pl={6}>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text>
                1.1. Eligibility: To use the Faucet, you must sign in via either Discord or Github and adhere to their
                respective terms of service.
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                1.2. Test Tokens (tAI3): The tokens distributed by the Faucet have no real monetary value and are solely
                for testing and experimentation purposes.
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                1.3. Compliance: You agree to use the tokens in a lawful and responsible manner, and you will not engage
                in any activities that violate applicable laws or regulations.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>

        <ListItem fontWeight='600' fontSize='1.1rem'>
          2. Token Distribution
        </ListItem>
        <ListItem pl={6}>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text>
                2.1. Availability: The Provider reserves the right to limit or suspend the distribution of test tokens
                at any time, without prior notice.
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                2.2. No Guarantees: The Provider does not guarantee the availability, accuracy, or reliability of the
                test tokens provided by the Faucet.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>

        <ListItem fontWeight='600' fontSize='1.1rem'>
          3. User Responsibilities
        </ListItem>
        <ListItem pl={6}>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text>
                3.1. Account Security: You are responsible for maintaining the security and confidentiality of your
                Discord or Github account used to access the Faucet.
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                3.2. Accuracy of Information: You agree to provide accurate and up-to-date information when accessing
                the Faucet.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>

        <ListItem fontWeight='600' fontSize='1.1rem'>
          4. Disclaimer
        </ListItem>
        <ListItem pl={6}>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text>
                4.1. No Warranty: The Faucet is provided &quot;as is&quot; and without any warranties, express or
                implied, including but not limited to, implied warranties of merchantability, fitness for a particular
                purpose, or non-infringement.
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                4.2. Limitation of Liability: To the fullest extent permitted by applicable law, the Provider shall not
                be liable for any direct, indirect, incidental, special, consequential, or punitive damages, or any loss
                of profits or revenues, whether incurred directly or indirectly, or any loss of data, use goodwill, or
                other intangible losses.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>

        <ListItem fontWeight='600' fontSize='1.1rem'>
          5. Changes to Terms
        </ListItem>
        <ListItem pl={6}>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text>
                5.1. The Provider reserves the right to modify or update these terms and conditions at any time. Changes
                will be effective upon posting the updated terms on the Faucet&apos;s website.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>

        <ListItem fontWeight='600' fontSize='1.1rem'>
          6. Privacy and Data Protection
        </ListItem>
        <ListItem pl={6}>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text>
                6.1. We do not store or log any personal data when you use the Faucet, except for transactional activity
                which is publicly visible on the blockchain. We do not use cookies or any other tracking technology on
                the Faucet website. By using the Faucet, you acknowledge and accept these data practices and warrant
                that all data provided by you is accurate.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>

        <ListItem fontWeight='600' fontSize='1.1rem'>
          7. Termination
        </ListItem>
        <ListItem pl={6}>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text>
                7.1. The Provider reserves the right to terminate or suspend your access to the Faucet and/or the
                availability of the Faucet service entirely at any time for any reason, including, but not limited to,
                violation of these terms and conditions.
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>

        <ListItem fontWeight='600' fontSize='1.1rem'>
          8. Contact Information
        </ListItem>
        <ListItem pl={6}>
          <UnorderedList spacing={3}>
            <ListItem>
              <Text>
                8.1. If you have any questions or concerns regarding these terms and conditions, please contact us at{' '}
                <Box
                  as='span'
                  color='#5870B3'
                  _hover={{
                    textDecoration: 'underline',
                    color: '#1D2C57'
                  }}>
                  <Link href='mailto:hello@autonomys.xyz'>hello@autonomys.xyz</Link>
                </Box>
              </Text>
            </ListItem>
          </UnorderedList>
        </ListItem>

        <ListItem mt={4}>
          <Text fontStyle='italic'>
            By using the Test Token Faucet, you acknowledge that you have read, understood, and agreed to these terms
            and conditions and the conditions listed on the page:{' '}
            <Box
              as='span'
              color='#5870B3'
              _hover={{
                textDecoration: 'underline',
                color: '#1D2C57'
              }}>
              <Link href='https://www.autonomys.xyz/terms-of-use' target='_blank'>
                https://www.autonomys.xyz/terms-of-use
              </Link>
            </Box>
          </Text>
        </ListItem>
      </UnorderedList>
    </>
  )
}
