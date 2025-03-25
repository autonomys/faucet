'use client'

import React from 'react'
import { FaExclamationCircle } from 'react-icons/fa'

const GlobalError: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <FaExclamationCircle className='text-red-500 text-6xl mb-4' />
      <h1 className='text-3xl font-bold text-center mt-4'>500 - Something went wrong</h1>
      <p className='text-gray-600 mt-2'>There was an error processing your request.</p>
    </div>
  )
}

export default GlobalError
