'use client'

import { WalletType } from '@/constants/wallet'
import useWallet from '@/hooks/useWallet'
import { cn } from '@/utils/cn'
import { formatAddress } from '@/utils/formatAddress'
import { limitText } from '@/utils/string'
import { shortString } from '@autonomys/auto-utils'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Fragment, useCallback, useMemo } from 'react'

interface AccountListDropdownProps {
  className?: string
  labelClassName?: string
}

function AccountListDropdown({ className, labelClassName }: AccountListDropdownProps) {
  const { actingAccount, subspaceAccount, accounts, changeAccount, disconnectWallet } = useWallet()

  const walletList = useMemo(
    () =>
      accounts
        ? accounts.map((account, chainIdx) => (
            <Listbox.Option
              key={chainIdx}
              className={({ active }) =>
                `w-full cursor-pointer select-none py-2 text-gray-900 dark:text-white ${
                  active && 'bg-gray-100 dark:bg-brand-secondary-hover'
                }`
              }
              value={account}>
              {({ selected }) => {
                const subAccount =
                  account.type === WalletType.subspace || (account as { type: string }).type === 'sr25519'
                    ? formatAddress(account.address)
                    : account.address
                const formattedAccount = subAccount && shortString(subAccount)
                return (
                  <div className='px-2'>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {account.name ? limitText(account.name, 16) : 'Account ' + chainIdx}
                    </span>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                      {formattedAccount}
                    </span>
                  </div>
                )
              }}
            </Listbox.Option>
          ))
        : null,
    [accounts]
  )

  const handleDisconnectWallet = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault()
      disconnectWallet()
    },
    [disconnectWallet]
  )

  const accountAddress: string = useMemo(() => {
    if (subspaceAccount) {
      return shortString(subspaceAccount)
    }
    if (actingAccount) {
      return shortString(actingAccount.address)
    }
    return ''
  }, [subspaceAccount, actingAccount])

  return (
    <Listbox value={actingAccount} onChange={changeAccount}>
      <div className='relative'>
        <Listbox.Button
          className={cn(
            `cursor-pointer text-white py-2 px-2 shadow dark:text-white bg-brand hover:bg-brand-hover rounded-md dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover`,
            className
          )}>
          <div className='flex items-center justify-between'>
            <span className={cn('ml-2 hidden w-5 truncate text-sm sm:block md:w-full', labelClassName)}>
              {accountAddress}
            </span>
            <ChevronDownIcon className={`size-6 text-white ui-open:rotate-180 ml-2`} aria-hidden='true' />
          </div>
        </Listbox.Button>
        <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
          <Listbox.Options className='absolute right-0 mt-1 max-h-80 w-44 min-w-40 overflow-y-auto rounded-md bg-white py-2 text-sm shadow-lg dark:bg-gray-darker'>
            {walletList}
            <button
              onClick={handleDisconnectWallet}
              className='text-left cursor-pointer w-full select-none p-2 text-gray-900 dark:bg-gray-darker dark:hover:bg-brand-secondary-hover dark:text-white'>
              Disconnect wallet
            </button>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export default AccountListDropdown
