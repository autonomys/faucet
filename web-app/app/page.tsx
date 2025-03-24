'use client'

import { Banner } from '@/components/Banner'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Navbar } from '@/components/Navbar'
import { TokenCard } from '@/components/TokenCard'

const AutonomysFaucet: React.FC = () => {
  return (
    <div className='min-h-screen bg-background-light dark:bg-background-darkest'>
      <Banner />
      <Navbar />
      <main className='container mx-auto p-4'>
        <div className='max-w-3xl mx-auto'>
          <Header />
          <TokenCard />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default AutonomysFaucet
