import { TokenRequested } from '@/components/RequestTokenButton'
import { ToastContent } from '@/components/ToastContent'
import { Contract } from '@/constants/contracts'
import { formatSeconds } from '@/utils/time'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { ImSpinner2 } from 'react-icons/im'
import { toast } from 'react-toastify'
import { useContractReads, useNetwork } from 'wagmi'

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
        return toast.error(
          <ToastContent
            title='Error requesting token'
            description='Please make sure you are following Autonomys GitHub account and connect your GitHub account again.'
          />
        )
      if (session.user.accountType === 'discord' && !session.user.isDiscordGuildMember)
        return toast.error(
          <ToastContent
            title='Error requesting token'
            description='Please make sure you are member of the Discord server and connect your Discord account again.'
          />
        )
      setIsLoading(true)
      const withdrawalAmount = data[0].status === 'success' ? (data[0].result as bigint) : BigInt(0)
      const nextAccessTime = data[1].status === 'success' ? (data[1].result as bigint) : BigInt(0)
      const now = BigInt(Math.floor(Date.now() / 1000))
      switch (true) {
        case now < nextAccessTime:
          toast.error(
            <ToastContent
              title='Error requesting token'
              description={`You can request token again in ${formatSeconds(
                Number(BigInt(nextAccessTime) - BigInt(now))
              )}.`}
            />
          )
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
                toast.success(<TokenRequested withdrawalAmount={withdrawalAmount} chain={chain} res={res} />)
              else
                toast.error(
                  <ToastContent
                    title='Error requesting token'
                    description='There was an error in the request, please try again.'
                  />
                )
              setIsSuccess(true)
            })
            .catch((err) => {
              console.error('Error', err)
              toast.error(
                <ToastContent
                  title='Error requesting token'
                  description="We couldn't request token for you. Please try again."
                />
              )
              setIsError(true)
            })
            .finally(() => {
              setIsLoading(false)
            })
      }
    } else
      toast.error(
        <ToastContent
          title='Error requesting token'
          description="We couldn't request token for you. Make sure you are on Autonomys Auto-EVM network and try again."
        />
      )
  }

  const reset = () => {
    setIsLoading(false)
    setIsError(false)
    setIsSuccess(false)
  }

  return (
    <div className='flex flex-row gap-x-2'>
      <button
        className='cursor-pointer px-3 py-1 text-sm border border-gray-300 bg-brand hover:bg-brand-hover rounded inline-flex items-center text-white disabled:opacity-50 disabled:cursor-not-allowed'
        onClick={async () => await handleRequestToken()}
        disabled={isLoading || isError || isSuccess}>
        {isLoading && <ImSpinner2 className='animate-spin h-5 w-5 mr-2' />}
        Request token
      </button>
      {(isLoading || isError || isSuccess) && (
        <button
          className='cursor-pointer px-3 py-1 text-sm border border-gray-300 bg-brand hover:bg-brand-hover rounded inline-flex items-center text-white'
          onClick={reset}>
          Reset request
        </button>
      )}
    </div>
  )
}
