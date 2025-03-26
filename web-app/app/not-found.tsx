import React from 'react'
import { FaExclamationTriangle } from 'react-icons/fa'

const NotFound: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <FaExclamationTriangle className='text-yellow-500 text-6xl mb-4' />
      <h1 className='text-3xl font-bold text-center mt-4'>404 - Page not found</h1>
      <p className='text-gray-600 mt-2'>The page you are looking for does not exist.</p>
    </div>
  )
}

export default NotFound
