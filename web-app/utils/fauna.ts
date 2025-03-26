import { Client, Expr, ExprArg, FaunaHttpErrorResponseContent, query as faunaQuery } from 'faunadb'

type Stats = {
  addresses: string[]
  uniqueAddresses: number
  requests: number
  requestsByType: {
    [key: string]: number
  }
  requestDate: string
  slackMessageId: string
  createdAt: Expr
}

const faunaDbClient = new Client({
  secret: process.env.FAUNA_DB_SECRET || '',
  keepAlive: false,
  queryTimeout: 2000,
  timeout: 30,
  http2SessionIdleTime: 1000,
  domain: 'db.us.fauna.com',
  scheme: 'https'
})

export const findRequest = async (accountId: string, requestedAt: string, accountType: string = 'discord') => {
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
  accountId: string,
  requestedAt: string,
  txHash: string,
  accountType: string = 'discord'
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
    .catch((error: FaunaHttpErrorResponseContent) => {
      console.error('error', error)
    })
}

export const findStats = async (
  requestDate: string
): Promise<void | null | { ref: ExprArg; ts: number; data: Stats }[]> => {
  const stats = await faunaDbClient
    .query(faunaQuery.Paginate(faunaQuery.Match(faunaQuery.Index('stats_by_requestDate'), requestDate)))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((response: any) => {
      const resultsRefs = response.data
      if (resultsRefs.length === 0) return null

      const results = resultsRefs.map((ref: ExprArg) => {
        return faunaQuery.Get(ref)
      })

      return faunaDbClient.query(results) as Promise<{ ref: ExprArg; ts: number; data: Stats }[]>
    })
    .catch((error: FaunaHttpErrorResponseContent) => {
      console.error('error', error)
    })
  return stats
}

export const createStats = async (
  address: string,
  accountType: string,
  slackMessageId: string | undefined,
  requestDate: string
) => {
  await faunaDbClient
    .query(
      faunaQuery.Create(faunaQuery.Ref('classes/stats'), {
        data: {
          addresses: [address],
          uniqueAddresses: 1,
          requests: 1,
          requestsByType: {
            [accountType]: 1
          },
          requestDate,
          slackMessageId: slackMessageId || '',
          createdAt: faunaQuery.Now()
        }
      })
    )
    .catch((error: FaunaHttpErrorResponseContent) => {
      console.error('error', error)
    })
}

export const updateStats = async (document: ExprArg, accountType: string, data: Stats, address: string) => {
  const isAddressAlreadyInStats = data.addresses.find((a: string) => a === address)
  const newData = {
    ...data,
    addresses: isAddressAlreadyInStats ? data.addresses : [...data.addresses, address],
    uniqueAddresses: isAddressAlreadyInStats ? data.addresses.length : data.addresses.length + 1,
    requests: data.requests + 1,
    requestsByType: {
      ...data.requestsByType,
      [accountType]: data.requestsByType[accountType] ? data.requestsByType[accountType] + 1 : 1
    }
  }
  await faunaDbClient
    .query(
      faunaQuery.Update(faunaQuery.Ref(document), {
        data: newData
      })
    )
    .then((response: object) => {
      return response
    })
    .catch((error: FaunaHttpErrorResponseContent) => {
      console.error('error', error)
      return error
    })
}
