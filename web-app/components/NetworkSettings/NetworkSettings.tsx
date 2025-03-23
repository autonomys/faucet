'use client'

import { nova } from '@/constants/networks'
import { Check, Copy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const NetworkSettings: React.FC = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const copyToClipboard = (value: string, fieldName: string) => {
    navigator.clipboard.writeText(value)
    setCopiedField(fieldName)

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Reset the copied state after 2 seconds
    timeoutRef.current = setTimeout(() => {
      setCopiedField(null)
    }, 2000)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const networkData = [
    { name: 'Network Name', value: nova.name, id: 'network' },
    { name: 'RPC URL', value: nova.rpcUrls.default.http[0], id: 'rpc' },
    { name: 'Chain ID', value: nova.id.toString(), id: 'chainId' },
    {
      name: 'Currency Symbol',
      value: nova.nativeCurrency.symbol,
      id: 'currency'
    },
    {
      name: 'Block explorer URL',
      value: nova.blockExplorers?.default.url ?? '',
      id: 'explorer'
    }
  ]

  return (
    <div className='py-8 space-y-6'>
      <h3 className='text-xl font-semibold mb-4'>Network Settings</h3>

      <div className='grid gap-4'>
        {networkData.map((item) => (
          <div key={item.id} className='bg-gray-100 dark:bg-gray-800 p-4 rounded-lg'>
            <h4 className='font-medium mb-2'>{item.name}</h4>
            <div className='flex items-center justify-between'>
              <p className={item.value.length > 30 ? 'text-sm' : ''}>{item.value}</p>
              <div className='relative'>
                <button
                  className='text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
                  onClick={() => copyToClipboard(item.value, item.id)}
                  onMouseEnter={() => setTooltipVisible(item.id)}
                  onMouseLeave={() => setTooltipVisible(null)}
                  aria-label={`Copy ${item.name}`}>
                  {copiedField === item.id ? (
                    <Check className='h-4 w-4 text-green-500' />
                  ) : (
                    <Copy className='h-4 w-4' />
                  )}
                </button>

                {/* Custom tooltip */}
                {tooltipVisible === item.id && (
                  <div className='absolute right-[-10px] bottom-full mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm whitespace-nowrap'>
                    {copiedField === item.id ? 'Copied!' : 'Copy to clipboard'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
