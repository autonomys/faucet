import { NetworkId } from '@autonomys/auto-utils'

export interface Indexer {
  title: string
  network: NetworkId
  squids: {
    old: string
    accounts?: string
    leaderboard?: string
    staking?: string
  }
}

export const indexers: Indexer[] = [
  {
    title: 'Gemini 3h',
    network: NetworkId.GEMINI_3H,
    squids: {
      old: 'https://squid.gemini-3h.subspace.network/graphql',
      accounts: 'https://autonomys-labs.squids.live/accounts-squid/addons/hasura/v1/graphql',
      leaderboard: 'https://autonomys-labs.squids.live/leaderboard-squid/addons/hasura/v1/graphql',
      staking: 'https://autonomys-labs.squids.live/staking-squid/addons/hasura/v1/graphql'
    }
  },
  {
    title: 'Localhost',
    network: NetworkId.LOCALHOST,
    squids: {
      old: 'http://localhost:4349/graphql'
    }
  },
  {
    title: 'Taurus',
    network: NetworkId.TAURUS,
    squids: {
      old: 'https://squid.taurus.subspace.network/graphql'
    }
  }
]

export const defaultIndexer = indexers.find((indexer) => indexer.network === NetworkId.GEMINI_3H) || indexers[0]
