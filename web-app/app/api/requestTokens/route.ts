// app/api/requestTokens/route.ts

import { contracts } from '@/constants/contracts'
import { metadata } from '@/constants/metadata'
import { networks, nova } from '@/constants/serverNetworks'
import { buildSlackStatsMessage, createStats, findStats, sendSlackMessage, updateStats } from '@/utils'
import { JsonFragment } from '@ethersproject/abi'
import { Contract, Wallet, providers } from 'ethers'
import { Client, query as faunaQuery } from 'faunadb'
import { NextRequest, NextResponse } from 'next/server'

type AccountType = 'github' | 'discord' | 'farcaster'

const faunaDbClient = new Client({
  secret: process.env.FAUNA_DB_SECRET || '',
  keepAlive: false,
  queryTimeout: 2000,
  timeout: 30,
  http2SessionIdleTime: 1000,
  domain: 'db.us.fauna.com',
  scheme: 'https'
})

const findRequest = async (accountType: AccountType, accountId: string, requestedAt: string) => {
  return await faunaDbClient
    .query(
      faunaQuery.Paginate(
        faunaQuery.Match(
          faunaQuery.Index('requestTokens_by_accountWithTimestamp'),
          `${accountType}-${accountId}-${requestedAt}`
        )
      )
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((response: any) => response.data.length > 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((error: any) => {
      console.error('error', error)
      return false
    })
}

const saveRequest = async (
  address: string,
  accountType: AccountType,
  accountId: string,
  requestedAt: string,
  txHash: string
) => {
  await faunaDbClient
    .query(
      faunaQuery.Create(faunaQuery.Ref('classes/requestTokens'), {
        data: {
          address,
          account: `${accountType}-${accountId}`,
          accountType,
          accountId,
          accountWithTimestamp: `${accountType}-${accountId}-${requestedAt}`,
          txHash,
          requestedAt,
          createdAt: faunaQuery.Now()
        }
      })
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .catch((error: any) => {
      console.error('error', error)
    })
}

const incrementFaucetRequestsCount = async (address: string, accountType: AccountType, requestDate: string) => {
  const stats = await findStats(requestDate)

  if (!stats || stats.length === 0) {
    const slackMessageId = await sendSlackMessage(
      'Current week evm-faucet requests',
      buildSlackStatsMessage('update', 1, 1)
    )
    await createStats(address, accountType, slackMessageId, requestDate)
  } else {
    const statsFound = stats[0].data
    const isExisting = statsFound.addresses.includes(address)

    await sendSlackMessage(
      'Current week evm-faucet requests',
      buildSlackStatsMessage(
        'update',
        statsFound.requests + 1,
        isExisting ? statsFound.uniqueAddresses : statsFound.uniqueAddresses + 1,
        {
          ...statsFound.requestsByType,
          [accountType]: (statsFound.requestsByType[accountType] || 0) + 1
        }
      ),
      statsFound.slackMessageId
    )

    await updateStats(stats[0].ref, accountType, statsFound, address)
  }
}

export async function POST(req: NextRequest) {
  const CURRENT_TIME = new Date()
  const REQUEST_DATE = CURRENT_TIME.toISOString().slice(0, 16)
  const STATS_DATE = CURRENT_TIME.toISOString().slice(0, 10)

  const body = await req.json()
  let isFarcasterFrame = false

  if (body?.trustedData?.messageBytes) {
    isFarcasterFrame = true

    const validationRes = await fetch('https://api.neynar.com/v2/farcaster/frame/validate', {
      headers: {
        api_key: 'NEYNAR_ONCHAIN_KIT',
        accept: 'application/json',
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        message_bytes_in_hex: body.trustedData.messageBytes
      })
    })

    const data = await validationRes.json()

    body.chainId = nova.id
    body.address = data.action.interactor.verified_addresses.eth_addresses[0] || data.action.interactor.custody_address
    body.accountType = 'farcaster'
    body.accountId = data.action.interactor.fid
  }

  if (!process.env.PRIVATE_KEY) {
    throw new Error('Missing PRIVATE_KEY environment variable')
  }

  try {
    const { chainId, address, accountType, accountId } = body as {
      chainId: number
      address: string
      accountType: AccountType
      accountId: string
    }

    const rpc = networks.find((n) => n.id === chainId)?.rpcUrls?.default?.http[0]
    if (!rpc) throw new Error('Unknown chainId')

    const provider = new providers.JsonRpcProvider({
      url: rpc,
      skipFetchSetup: true
    })
    const minterWallet = new Wallet(process.env.PRIVATE_KEY, provider)
    const faucetContract = contracts.find((c) => c.chainId === chainId && c.name === 'Faucet')
    if (!faucetContract) throw new Error('Unknown faucet contract')

    const alreadyRequested = await findRequest(accountType, accountId, REQUEST_DATE)

    if (!alreadyRequested) {
      const faucetAbi = faucetContract.abi as unknown as JsonFragment[]
      const faucet = new Contract(faucetContract.address, faucetAbi, minterWallet)

      const tx = await faucet.populateTransaction.requestTokens(address)
      const txResponse = await minterWallet.sendTransaction(tx)

      await saveRequest(address, accountType, accountId, REQUEST_DATE, txResponse.hash)
      await incrementFaucetRequestsCount(address, accountType, STATS_DATE)

      if (isFarcasterFrame) {
        return new NextResponse(generateSuccessHTML(address, txResponse.hash), {
          headers: { 'Content-Type': 'text/html' }
        })
      }

      return NextResponse.json({ message: 'Success', txResponse })
    } else {
      return NextResponse.json({ message: 'Success', txResponse: null })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error requesting token', error)

    if (isFarcasterFrame) {
      return new NextResponse(generateErrorHTML(), {
        headers: { 'Content-Type': 'text/html' }
      })
    }

    return NextResponse.json({ message: 'Error', error: error.message || 'Unknown error' }, { status: 400 })
  }
}

function generateSuccessHTML(address: string, hash: string) {
  return `<!DOCTYPE html>
  <html><head>
  <meta property='fc:frame' content='vNext' />
  <meta property='fc:frame:image' content='${metadata.url}/images/share-final.png' />
  <meta property='fc:frame:image:aspect_ratio' content='1.91:1' />
  <meta property='fc:frame:post_url' content='request_url' />
  <meta property='fc:frame:button:1' content='View transaction' />
  <meta property='fc:frame:button:1:action' content='link' />
  <meta property='fc:frame:button:1:target' content='${nova.blockExplorers?.default.url}/tx/${hash}' />
  <meta property='fc:frame:button:2' content='View your wallet' />
  <meta property='fc:frame:button:2:action' content='link' />
  <meta property='fc:frame:button:2:target' content='${nova.blockExplorers?.default.url}/address/${address}' />
  </head></html>`
}

function generateErrorHTML() {
  return `<!DOCTYPE html>
  <html><head>
  <meta property='fc:frame' content='vNext' />
  <meta property='fc:frame:image' content='${metadata.url}/images/share-request-error.png' />
  <meta property='fc:frame:image:aspect_ratio' content='1.91:1' />
  <meta property='fc:frame:post_url' content='request_url' />
  <meta property='fc:frame:button:1' content='Try again' />
  <meta property='fc:frame:button:1:action' content='post' />
  <meta property='fc:frame:button:1:target' content='${metadata.url}/api/requestTokens' />
  </head></html>`
}
