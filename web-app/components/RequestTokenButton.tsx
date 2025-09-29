'use client'

import { ToastContent } from '@/components/ToastContent'
import { TokenRequested } from '@/components/TokenRequested'
import { Contract } from '@/constants/contracts'
import { NetworkOptions, useNetworkStore } from '@/store/useStore'
import { formatSeconds } from '@/utils/time'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'react-toastify'
import { useContractReads, useNetwork } from 'wagmi'

interface RequestTokenButtonProps {
  contract?: Contract
  address: string
}

export const RequestTokenButton: React.FC<RequestTokenButtonProps> = ({ contract, address }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { data: session } = useSession()
  const { chain } = useNetwork()
  const { network } = useNetworkStore()

  const { data } = useContractReads({
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

  const validateSession = () => {
    if (!session || !session.user) {
      toast.error(<ToastContent title='Error requesting token' description='Please connect your account first.' />)
      return false
    }
    if (session.user.accountType === 'github' && !session.user.isGitHubFollower) {
      toast.error(
        <ToastContent
          title='Error requesting token'
          description='Please make sure you are following Autonomys GitHub account and connect your GitHub account again.'
        />
      )
      return false
    }
    if (session.user.accountType === 'discord' && !session.user.isDiscordGuildMember) {
      toast.error(
        <ToastContent
          title='Error requesting token'
          description='Please make sure you are member of the Discord server and connect your Discord account again.'
        />
      )
      return false
    }
    return true
  }

  const checkTimeLock = () => {
    if (!data || !data[1] || data[1].status !== 'success') return true

    const nextAccessTime = data[1].result as bigint
    const now = BigInt(Math.floor(Date.now() / 1000))
    if (now < nextAccessTime) {
      toast.error(
        <ToastContent
          title='Error requesting token'
          description={`You can request token again in ${formatSeconds(Number(BigInt(nextAccessTime) - BigInt(now)))}.`}
        />
      )
      return false
    }
    return true
  }

  const handleRequestToken = async () => {
    if (!validateSession()) return

    // Check the timelock
    if (!checkTimeLock()) {
      setIsError(true)
      return
    }
    setIsLoading(true)
    try {
      // Check if chain is defined
      if (!chain) {
        toast.error(<ToastContent title='Error requesting token' description='Network chain information is missing.' />)
        setIsError(true)
        setIsLoading(false)
        return
      }
      // Single EVM network API call
      const response = await fetch('/api/request-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chainId: chain.id,
          address,
          accountType: session?.user?.accountType,
          accountId: session?.user?.id
        })
      })

      const result = await response.json()

      if (response.ok && result.txResponse) {
        // Handle success - standardize the result format for the TokenRequested component
        const withdrawalAmount = data && data[0]?.status === 'success' ? (data[0].result as bigint) : BigInt(0)
        if (!chain) {
          toast.success(<ToastContent title='Success' description='Token request successful.' />)
        } else {
          toast.success(<TokenRequested withdrawalAmount={withdrawalAmount} chain={chain} res={result} />)
        }
        setIsSuccess(true)
      } else if (result.message === 'Success' && result.txResponse === null) {
        // Already requested case
        toast.info(
          <ToastContent
            title='Already requested'
            description='You have already requested tokens recently. Please try again later.'
          />
        )
        setIsError(true)
      } else {
        // Error case
        toast.error(
          <ToastContent
            title='Error requesting token'
            description={result.error || 'There was an error in the request, please try again.'}
          />
        )
        setIsError(true)
      }
    } catch (err) {
      console.error('Error', err)
      toast.error(
        <ToastContent
          title='Error requesting token'
          description="We couldn't request token for you. Please try again."
        />
      )
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setIsLoading(false)
    setIsError(false)
    setIsSuccess(false)
  }

  useEffect(() => {
    reset()
  }, [network])

  return (
    <div className='flex flex-row gap-x-2'>
      <button
        className='cursor-pointer px-3 py-1 text-sm border border-gray-300 bg-brand hover:bg-brand-hover rounded inline-flex items-center text-white disabled:opacity-50 disabled:cursor-not-allowed dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:border-brand-hover'
        onClick={handleRequestToken}
        disabled={isLoading || isError || isSuccess}>
        {isLoading && <ImSpinner2 className='animate-spin h-5 w-5 mr-2' />}
        Request token
      </button>
      {(isLoading || isError || isSuccess) && (
        <button
          className='cursor-pointer px-3 py-1 text-sm border border-gray-300 bg-brand hover:bg-brand-hover rounded inline-flex items-center text-white dark:bg-brand-secondary dark:hover:bg-brand-secondary-hover dark:border-brand-hover'
          onClick={reset}>
          Reset request
        </button>
      )}
    </div>
  )
}
