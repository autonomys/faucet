import { JsonFragment } from '@ethersproject/abi'
import { Contract, Wallet, providers } from 'ethers'
import { Client, FaunaHttpErrorResponseContent, query as faunaQuery } from 'faunadb'
import { NextApiRequest, NextApiResponse } from 'next'
import { metadata } from '../../config'
import { contracts } from '../../constants/contracts'
import { networks, nova } from '../../constants/networks'
import { buildSlackStatsMessage, createStats, findStats, sendSlackMessage, updateStats } from '../../utils'

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

export const findRequest = async (accountType: AccountType, accountId: string, requestedAt: string) => {
  return await faunaDbClient
    .query(
      faunaQuery.Paginate(
        faunaQuery.Match(
          faunaQuery.Index('requestTokens_by_accountWithTimestamp'),
          accountType + '-' + accountId + '-' + requestedAt
        )
      )
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((response: any) => {
      if (response.data.length === 0) return false
      return true
    })
    .catch((error: FaunaHttpErrorResponseContent) => {
      console.error('error', error)
    })
}

export const saveRequest = async (
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
          account: accountType + '-' + accountId,
          accountType,
          accountId,
          accountWithTimestamp: accountType + '-' + accountId + '-' + requestedAt,
          txHash,
          requestedAt,
          createdAt: faunaQuery.Now()
        }
      })
    )
    .catch((error: FaunaHttpErrorResponseContent) => {
      console.error('error', error)
    })
}

const incrementFaucetRequestsCount = async (address: string, accountType: AccountType, requestDate: string) => {
  const stats = await findStats(requestDate)
  console.log('stats', stats)
  if (!stats || stats === null || stats.length === 0) {
    const slackMessageId = await sendSlackMessage(
      'Current week evm-faucet requests',
      buildSlackStatsMessage('update', 1, 1)
    )
    await createStats(address, accountType, slackMessageId, requestDate)
  } else {
    const statsFound = stats[0].data
    const isExistingAddresses = statsFound.addresses.find((a: string) => a === address)
    await sendSlackMessage(
      'Current week evm-faucet requests',
      buildSlackStatsMessage(
        'update',
        statsFound.requests + 1,
        isExistingAddresses ? statsFound.uniqueAddresses : statsFound.uniqueAddresses + 1,
        {
          ...statsFound.requestsByType,
          [accountType]: statsFound.requestsByType[accountType] ? statsFound.requestsByType[accountType] + 1 : 1
        }
      ),
      statsFound.slackMessageId
    )
    await updateStats(stats[0].ref, accountType, statsFound, address)
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const CURRENT_TIME = new Date()
  // Keeping only the date and minutes to avoid spamming the faucet (reduce the number of digit to reduce time between requests)
  const REQUEST_DATE = CURRENT_TIME.toISOString().slice(0, 16) // Minutes precision
  const STATS_DATE = CURRENT_TIME.toISOString().slice(0, 10) // Daily precision

  // Farcaster Faucet Frame
  let isFarcasterFrame = false
  if (req.body && req.body.trustedData && req.body.trustedData.messageBytes) {
    isFarcasterFrame = true

    const response = await fetch('https://api.neynar.com/v2/farcaster/frame/validate', {
      headers: {
        api_key: 'NEYNAR_ONCHAIN_KIT',
        accept: 'application/json',
        'content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        message_bytes_in_hex: req.body.trustedData.messageBytes
      })
    })

    const data = await response.json().then((res) => {
      return res
    })

    // Override request body with Farcaster Faucet Frame data
    req.body.chainId = nova.id
    if (data.action.interactor.verified_addresses.eth_addresses.length > 0) {
      req.body.address = data.action.interactor.verified_addresses.eth_addresses[0]
    } else {
      req.body.address = data.action.interactor.custody_address
    }
    req.body.accountType = 'farcaster'
    req.body.accountId = data.action.interactor.fid
  }

  if (!process.env.PRIVATE_KEY) throw new Error('Missing PRIVATE_KEY env var')
  const PRIVATE_KEY = process.env.PRIVATE_KEY
  try {
    const { chainId, address, accountType, accountId } = req.body as {
      chainId: number
      address: string
      accountType: AccountType
      accountId: string
    }

    const rpc = networks.find((network) => network.id === chainId)?.rpcUrls?.default?.http[0]
    if (!rpc) throw new Error('Unknown chainId')

    const provider = new providers.JsonRpcProvider(rpc)
    const minterWallet = new Wallet(PRIVATE_KEY, provider)
    const faucetContract = contracts.find((contract) => contract.chainId === chainId && contract.name === 'Faucet')
    if (!faucetContract) throw new Error('Unknown faucet contract')

    const previousRequestFound = await findRequest(accountType, accountId, REQUEST_DATE)
    if (!previousRequestFound) {
      const faucetAbi = faucetContract.abi as unknown as JsonFragment[]
      const faucet = new Contract(faucetContract.address, faucetAbi, minterWallet)

      const tx = await faucet.populateTransaction.requestTokens(address)
      const txResponse = await minterWallet.sendTransaction(tx)
      await saveRequest(address, accountType, accountId, REQUEST_DATE, txResponse.hash)
      await incrementFaucetRequestsCount(address, accountType, STATS_DATE)

      if (isFarcasterFrame) {
        return res.status(200).send(`<!DOCTYPE html>
    <html>
    <head>
      <meta charSet='utf-8' />
      <meta name='language' content='english' />
      <meta httpEquiv='content-type' content='text/html' />
      <meta name='author' content='${metadata.author}' />
      <meta name='designer' content='${metadata.author}' />
      <meta name='publisher' content='${metadata.author}' />

      <title>${metadata.title}</title>
      <meta name='description' content='${metadata.description}' />
      <meta name='keywords' content='${metadata.keywords}' />
      <meta name='robots' content='index,follow' />
      <meta name='distribution' content='web' />
      <meta name='og:title' content='${metadata.title}' />
      <meta name='og:type' content='site' />
      <meta name='og:url' content='${metadata.url}' />
      <meta name='og:image' content='${metadata.url}/images/share-final.png' />
      <meta name='og:site_name' content='${metadata.title}' />
      <meta name='og:description' content='${metadata.description}' />

      <meta property='fc:frame' content='vNext' />
      <meta property='fc:frame:image' content='${metadata.url}/images/share-final.png' />
      <meta property='fc:frame:image:aspect_ratio' content='1.91:1' />
      <meta property='fc:frame:post_url' content='request_url' />

      <meta property='fc:frame:button:1' content='View transaction' />
      <meta property='fc:frame:button:1:action' content='link' />
      <meta property='fc:frame:button:1:target' content='${nova.blockExplorers?.default.url}/tx/${txResponse.hash}' />
      
      <meta property='fc:frame:button:2' content='View your wallet' />
      <meta property='fc:frame:button:2:action' content='link' />
      <meta property='fc:frame:button:2:target' content='${nova.blockExplorers?.default.url}/address/${address}' />
    </head>
    </html>`)
      }
      res.status(200).json({
        message: 'Success',
        txResponse
      })
    } else {
      res.status(200).json({
        message: 'Success',
        txResponse: null
      })
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error requesting token', error)
    if (isFarcasterFrame) {
      return res.status(200).send(`<!DOCTYPE html>
  <html>
  <head>
    <meta charSet='utf-8' />
    <meta name='language' content='english' />
    <meta httpEquiv='content-type' content='text/html' />
    <meta name='author' content='${metadata.author}' />
    <meta name='designer' content='${metadata.author}' />
    <meta name='publisher' content='${metadata.author}' />

    <title>${metadata.title}</title>
    <meta name='description' content='${metadata.description}' />
    <meta name='keywords' content='${metadata.keywords}' />
    <meta name='robots' content='index,follow' />
    <meta name='distribution' content='web' />
    <meta name='og:title' content='${metadata.title}' />
    <meta name='og:type' content='site' />
    <meta name='og:url' content='${metadata.url}' />
    <meta name='og:image' content='${metadata.url}/images/share-request-error.png' />
    <meta name='og:site_name' content='${metadata.title}' />
    <meta name='og:description' content='${metadata.description}' />

    <meta property='fc:frame' content='vNext' />
    <meta property='fc:frame:image' content='${metadata.url}/images/share-request-error.png' />
    <meta property='fc:frame:image:aspect_ratio' content='1.91:1' />
    <meta property='fc:frame:post_url' content='request_url' />

    <meta property='fc:frame:button:1' content='Try again' />
    <meta property='fc:frame:button:1:action' content='post' />
    <meta property='fc:frame:button:1:target' content='${metadata.url}/api/requestTokens' />
  </head>
  </html>`)
    }
    res.status(400).json({
      message: 'Error',
      error: JSON.stringify(error)
    })
  }
}

export default handler
