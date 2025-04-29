import { indexers, REQUEST_TYPES } from '@/constants'
import { walletBalanceLowSlackMessage } from '@/utils/slack'
import { balance, transfer } from '@autonomys/auto-consensus'
import { activateWallet, ActivateWalletParams, ApiPromise } from '@autonomys/auto-utils'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  try {
    if (!process.env.WALLET_CONSENSUS_URI) throw new Error('Missing WALLET_CONSENSUS_URI')
    if (!process.env.CONSENSUS_AMOUNT && process.env.CONSENSUS_AMOUNT !== '0')
      throw new Error('Missing CONSENSUS_AMOUNT')

    const pathname = req.nextUrl.pathname
    const chain = pathname.split('/').slice(3)[0]
    const requestType = pathname.split('/').slice(4)[0]
    if (requestType !== REQUEST_TYPES.Consensus)
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })

    const chainMatch = indexers.find((c) => c.network === chain)
    if (!chainMatch) return NextResponse.json({ error: 'Invalid chain' }, { status: 400 })

    const request = await req.json()
    const { address } = request

    const {
      api,
      accounts: [wallet]
    } = await activateWallet({
      uri: process.env.WALLET_CONSENSUS_URI,
      networkId: chainMatch.network
    } as ActivateWalletParams)

    // Get wallet free balance
    const { free } = await balance(api as unknown as ApiPromise, wallet.address)
    if (
      BigInt(free) <
      BigInt((Number(process.env.SLACK_BALANCE_NOTIFICATION_THRESHOLD) * Number(process.env.CONSENSUS_AMOUNT)) / 100)
    ) {
      await walletBalanceLowSlackMessage(free.toString(), wallet.address)
    }

    if (BigInt(free) <= BigInt(process.env.CONSENSUS_AMOUNT))
      return NextResponse.json({ error: 'Insufficient funds' }, { status: 400 })

    // Create and sign the transfer transaction
    const tx = await transfer(api as unknown as ApiPromise, address, process.env.CONSENSUS_AMOUNT)
    const txResponse = await tx.signAndSend(wallet)

    await api.disconnect()

    return NextResponse.json({
      message: 'Token requested successfully',
      txResponse: { hash: txResponse.toString() }
    })
  } catch (error) {
    console.error('Error processing token request:', error)
    return NextResponse.json({ error: 'Failed to request token' }, { status: 500 })
  }
}
