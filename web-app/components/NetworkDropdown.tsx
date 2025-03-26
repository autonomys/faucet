'use client'

import { NetworkOptions, useNetworkStore } from '@/store/useStore'
import { Check, ChevronDown } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { AutonomysSymbol } from './AutonomysSymbol'

type DropdownOption = {
  label: string
  value: NetworkOptions
}

type NetworkDropdownProps = {
  options: DropdownOption[]
  onSelect: (option: NetworkOptions) => void
  placeholder?: string
}

const NetworkDropdown: React.FC<NetworkDropdownProps> = ({ options, onSelect, placeholder = 'Select an option' }) => {
  const { network, setNetwork } = useNetworkStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option: NetworkOptions) => {
    setNetwork(option)
    onSelect(option)
    setIsOpen(false)
  }

  const selectedLabel = options.find((o) => o.value === network)?.label || placeholder

  return (
    <div className='relative w-54 my-auto' ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='shadow flex w-full items-center justify-between py-2 px-3 bg-white text-gray-900 rounded-full cursor-pointer dark:bg-brand-secondary dark:text-white'>
        <div className='flex items-center gap-2'>
          <AutonomysSymbol fill='currentColor' />
          <span className='text-sm my-auto'>{selectedLabel}</span>
        </div>
        <ChevronDown
          size={16}
          className={`ml-2 transition-transform text-gray-900 my-auto dark:text-white ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <ul className='absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg max-h-60 overflow-auto py-2 dark:bg-brand-secondary'>
          {options.map((option, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(option.value)}
              className={`flex items-center gap-2 px-4 py-2 text-grey-900 text-sm cursor-pointer hover:bg-gray-100 dark:text-white dark:bg-brand-secondary hover:dark:bg-brand-secondary-hover ${
                network === option.value ? 'font-medium' : ''
              }`}>
              <div className='w-4'>{network === option.value && <Check size={16} className='text-green-400' />}</div>
              <span className='flex-1'>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NetworkDropdown
