export const Terms: React.FC = () => {
  return (
    <div className='py-8 space-y-6'>
      <h3 className='text-xl font-semibold mb-4'>Terms and Conditions</h3>
      <span className='text-xs text-muted-foreground flex justify-end dark:text-gray-400'>
        Last Updated: October 26, 2023
      </span>
      <div className='bg-muted p-4 rounded-lg text-sm dark:bg-background-darkest'>
        <ul className='list-none space-y-4'>
          <li className='font-semibold text-lg'>1. Use of the Faucet</li>
          <li className='pl-6'>
            <ul className='space-y-3 list-disc list-inside'>
              <li>
                1.1. Eligibility: To use the Faucet, you must sign in via either Discord or Github and adhere to their
                respective terms of service.
              </li>
              <li>
                1.2. Test Tokens (tAI3): The tokens distributed by the Faucet have no real monetary value and are solely
                for testing and experimentation purposes.
              </li>
              <li>
                1.3. Compliance: You agree to use the tokens in a lawful and responsible manner, and you will not engage
                in any activities that violate applicable laws or regulations.
              </li>
            </ul>
          </li>

          <li className='font-semibold text-lg'>2. Token Distribution</li>
          <li className='pl-6'>
            <ul className='space-y-3 list-disc list-inside'>
              <li>
                2.1. Availability: The Provider reserves the right to limit or suspend the distribution of test tokens
                at any time, without prior notice.
              </li>
              <li>
                2.2. No Guarantees: The Provider does not guarantee the availability, accuracy, or reliability of the
                test tokens provided by the Faucet.
              </li>
            </ul>
          </li>

          <li className='font-semibold text-lg'>3. User Responsibilities</li>
          <li className='pl-6'>
            <ul className='space-y-3 list-disc list-inside'>
              <li>
                3.1. Account Security: You are responsible for maintaining the security and confidentiality of your
                Discord or Github account used to access the Faucet.
              </li>
              <li>
                3.2. Accuracy of Information: You agree to provide accurate and up-to-date information when accessing
                the Faucet.
              </li>
            </ul>
          </li>

          <li className='font-semibold text-lg'>4. Disclaimer</li>
          <li className='pl-6'>
            <ul className='space-y-3 list-disc list-inside'>
              <li>
                4.1. No Warranty: The Faucet is provided &quot;as is&quot; and without any warranties, express or
                implied, including but not limited to, implied warranties of merchantability, fitness for a particular
                purpose, or non-infringement.
              </li>
              <li>
                4.2. Limitation of Liability: To the fullest extent permitted by applicable law, the Provider shall not
                be liable for any direct, indirect, incidental, special, consequential, or punitive damages, or any loss
                of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or
                other intangible losses.
              </li>
            </ul>
          </li>

          <li className='font-semibold text-lg'>5. Changes to Terms</li>
          <li className='pl-6'>
            <ul className='space-y-3 list-disc list-inside'>
              <li>
                5.1. The Provider reserves the right to modify or update these terms and conditions at any time. Changes
                will be effective upon posting the updated terms on the Faucet&apos;s website.
              </li>
            </ul>
          </li>

          <li className='font-semibold text-lg'>6. Privacy and Data Protection</li>
          <li className='pl-6'>
            <ul className='space-y-3 list-disc list-inside'>
              <li>
                6.1. We do not store or log any personal data when you use the Faucet, except for transactional activity
                which is publicly visible on the blockchain. We do not use cookies or any other tracking technology on
                the Faucet website. By using the Faucet, you acknowledge and accept these data practices and warrant
                that all data provided by you is accurate.
              </li>
            </ul>
          </li>

          <li className='font-semibold text-lg'>7. Termination</li>
          <li className='pl-6'>
            <ul className='space-y-3 list-disc list-inside'>
              <li>
                7.1. The Provider reserves the right to terminate or suspend your access to the Faucet and/or the
                availability of the Faucet service entirely at any time for any reason, including, but not limited to,
                violation of these terms and conditions.
              </li>
            </ul>
          </li>

          <li className='font-semibold text-lg'>8. Contact Information</li>
          <li className='pl-6'>
            <ul className='space-y-3 list-disc list-inside'>
              <li>
                8.1. If you have any questions or concerns regarding these terms and conditions, please contact us at{' '}
                <a href='mailto:hello@autonomys.xyz' className='text-brand hover:underline hover:text-[#1D2C57]'>
                  hello@autonomys.xyz
                </a>
              </li>
            </ul>
          </li>

          <li className='mt-4 italic'>
            By using the Test Token Faucet, you acknowledge that you have read, understood, and agreed to these terms
            and conditions and the conditions listed on the page:{' '}
            <a
              href='https://www.autonomys.xyz/terms-of-use'
              target='_blank'
              rel='noopener noreferrer'
              className='text-brand hover:underline hover:text-[#1D2C57]'>
              https://www.autonomys.xyz/terms-of-use
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
