import { indexers, REQUEST_TYPES } from '@/constants'
import { buildSlackStatsMessage, sendSlackMessage } from '@/utils'
import { verifyToken } from '@/utils/auth/verifyToken'
import { createStats, findRequest, findStats, saveRequest, updateStats } from '@/utils/fauna'
import { walletBalanceLowSlackMessage } from '@/utils/slack'
import { balance, transfer } from '@autonomys/auto-consensus'
import { activateWallet, ActivateWalletParams, ApiPromise } from '@autonomys/auto-utils'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (req: NextRequest) => {
  const CURRENT_TIME = new Date()
  const REQUEST_DATE = CURRENT_TIME.toISOString().slice(0, 16)
  const STATS_DATE = CURRENT_TIME.toISOString().slice(0, 10)
  const ACCOUNT_TYPE = 'consensus'

  try {
    if (!process.env.WALLET_CONSENSUS_URI) throw new Error('Missing WALLET_CONSENSUS_URI')
    if (!process.env.CONSENSUS_AMOUNT && process.env.CONSENSUS_AMOUNT !== '0')
      throw new Error('Missing CONSENSUS_AMOUNT')

    const session = await verifyToken()

    const pathname = req.nextUrl.pathname
    const chain = pathname.split('/').slice(3)[0]
    const requestType = pathname.split('/').slice(4)[0]
    if (requestType !== REQUEST_TYPES.Consensus)
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 })

    const chainMatch = indexers.find((c) => c.network === chain)
    if (!chainMatch) return NextResponse.json({ error: 'Invalid chain' }, { status: 400 })

    const request = await req.json()
    const { address } = request

    // Check if already requested
    const alreadyRequested = await findRequest(session.id, REQUEST_DATE, ACCOUNT_TYPE)
    if (alreadyRequested) return NextResponse.json({ message: 'Success', txResponse: null })

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

    // Save request to database
    await saveRequest(address, session.id, REQUEST_DATE, txResponse.toString(), ACCOUNT_TYPE)

    // Update stats
    const stats = await findStats(STATS_DATE)
    if (!stats || stats.length === 0) {
      const slackMessageId = await sendSlackMessage(
        'Current week consensus requests',
        buildSlackStatsMessage('update', 1, 1)
      )
      await createStats(address, ACCOUNT_TYPE, slackMessageId, STATS_DATE)
    } else {
      const statsFound = stats[0].data
      const isExisting = statsFound.addresses.includes(address)

      await sendSlackMessage(
        'Current week consensus requests',
        buildSlackStatsMessage(
          'update',
          statsFound.requests + 1,
          isExisting ? statsFound.uniqueAddresses : statsFound.uniqueAddresses + 1,
          {
            ...statsFound.requestsByType,
            [ACCOUNT_TYPE]: (statsFound.requestsByType[ACCOUNT_TYPE] || 0) + 1
          }
        ),
        statsFound.slackMessageId
      )

      await updateStats(stats[0].ref, ACCOUNT_TYPE, statsFound, address)
    }

    await api.disconnect()

    return NextResponse.json({
      message: 'Token requested successfully',
      txResponse: { hash: txResponse.hash.toString() }
    })
  } catch (error) {
    console.error('Error processing token request:', error)
    return NextResponse.json({ error: 'Failed to request token' }, { status: 500 })
  }
}
