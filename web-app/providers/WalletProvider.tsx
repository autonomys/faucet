'use client'

import { WalletType } from '@/constants/wallet'
import { useSafeLocalStorage } from '@/hooks/useSafeLocalStorage'
import type { ChainParam } from '@/types/app'
import type { WalletAccountWithType } from '@/types/wallet'
import { formatAddress } from '@/utils/formatAddress'
import { activate, ApiPromise, createConnection, networks } from '@autonomys/auto-utils'
import { Domain } from '@autonomys/auto-utils/dist/types/domain'
import { sendGAEvent } from '@next/third-parties/google'
import { InjectedExtension } from '@polkadot/extension-inject/types'
import { getWalletBySource, getWallets } from '@talismn/connect-wallets'
import { getSession, signOut } from 'next-auth/react'
import { useParams } from 'next/navigation'
import { createContext, FC, ReactNode, useCallback, useEffect, useState } from 'react'

interface DomainWithApi extends Domain {
  api: ApiPromise
}
export type DomainsApis = { [key: string]: DomainWithApi }

export type WalletContextValue = {
  api: ApiPromise | undefined
  domainsApis: DomainsApis
  isReady: boolean
  accounts: WalletAccountWithType[] | undefined | null
  error: Error | null
  injector: InjectedExtension | null
  actingAccount: WalletAccountWithType | undefined
  extensions: InjectedExtension[] | undefined
  disconnectWallet: () => void
  setActingAccount: (account: WalletAccountWithType) => void
  setPreferredExtension: (extension: string) => void
  preferredExtension: string | undefined
  subspaceAccount: string | undefined
  handleSelectFirstWalletFromExtension: (source: string) => Promise<void>
  changeAccount: (account: WalletAccountWithType) => void
}

export const WalletContext = createContext<WalletContextValue>(
  // @ts-expect-error It's a good practice not to give a default value even though the linter tells you so
  {}
)

type Props = {
  children?: ReactNode
}

export const WalletProvider: FC<Props> = ({ children }) => {
  const { chain } = useParams<ChainParam>()
  const [api, setApi] = useState<ApiPromise>()
  const [domainsApis, setDomainsApis] = useState<DomainsApis>({})
  const [isReady, setIsReady] = useState(false)
  const [accounts, setAccounts] = useState<WalletAccountWithType[] | null | undefined>(undefined)
  const [extensions] = useState<InjectedExtension[] | undefined>(undefined)
  const [error, setError] = useState<Error | null>(null)
  const [injector, setInjector] = useState<InjectedExtension | null>(null)
  const [actingAccount, setActingAccount] = useState<WalletAccountWithType | undefined>(undefined)
  const [subspaceAccount, setSubspaceAccount] = useState<string | undefined>(undefined)
  const [preferredAccount, setPreferredAccount] = useSafeLocalStorage('localAccount', null)
  const [preferredExtension, setPreferredExtension] = useSafeLocalStorage('extensionSource', null)

  const prepareApi = useCallback(async () => {
    try {
      return await activate({ networkId: chain })
    } catch (error) {
      console.error('Failed to prepare API for chain', chain, 'error:', error)
    }
  }, [chain])

  const prepareDomainsApis = useCallback(async () => {
    try {
      const network = networks.find((network) => network.id === chain)
      if (!network || !network.domains || network.domains.length === 0) return
      const domains = network.domains

      const domainApis = await Promise.all(
        domains.map((d) => createConnection(d.rpcUrls.map((rpc) => rpc.replace('https://', 'wss://'))))
      )

      return domains.reduce(
        (acc, d, index) => ({
          ...acc,
          [d.domainId]: { ...d, api: domainApis[index] }
        }),
        {}
      )
    } catch (error) {
      console.error('Failed to prepare domains API for chain', chain, 'error:', error)
    }
  }, [chain])

  const setup = useCallback(async () => {
    setApi(await prepareApi())
    const domainsApis = await prepareDomainsApis()
    if (domainsApis) setDomainsApis(domainsApis)
  }, [prepareApi, prepareDomainsApis])

  const signOutSessionOnAccountChange = useCallback(async (subspaceAccount?: string) => {
    const session = await getSession()
    if (!subspaceAccount && session) {
      await signOut({ redirect: false })
    }
  }, [])

  const changeAccount = useCallback(
    async (account: WalletAccountWithType) => {
      try {
        const type =
          account.type === WalletType.subspace || (account as { type: string }).type === 'sr25519'
            ? WalletType.subspace
            : WalletType.ethereum
        setActingAccount({
          ...account,
          type
        })
        const _subspaceAccount = formatAddress(account.address)
        setSubspaceAccount(_subspaceAccount)
        setPreferredAccount(account.address)
        const newInjector = extensions?.find((extension) => extension.name === account.source)
        if (newInjector) setInjector(newInjector)
        setIsReady(true)
        sendGAEvent({
          event: 'wallet_select_account',
          value: `source:${account.source}`
        })
      } catch (error) {
        console.error('Failed to change account', error)
      }
    },
    [extensions, setPreferredAccount]
  )

  const disconnectWallet = useCallback(async () => {
    setInjector(null)
    setAccounts([])
    setActingAccount(undefined)
    setSubspaceAccount(undefined)
    setPreferredAccount(null)
    setPreferredExtension(null)
    setIsReady(false)
    await signOutSessionOnAccountChange()
    sendGAEvent('event', 'wallet_disconnect')
  }, [setPreferredAccount, setPreferredExtension, signOutSessionOnAccountChange])

  const handleGetWalletFromExtension = useCallback(
    async (source: string) => {
      const wallet = getWalletBySource(source)
      if (wallet) {
        await wallet.enable(process.env.NEXT_PUBLIC_TALESMAN_DAPP_NAME || 'Autonomy Block Explorer')
        if (wallet.extension) setInjector(wallet.extension)
        const walletAccounts = (await wallet.getAccounts()) as WalletAccountWithType[]
        setAccounts(walletAccounts)
        setPreferredExtension(source)
        sendGAEvent({
          event: 'wallet_get_wallet',
          value: `source:${source}`
        })
        return walletAccounts
      }
    },
    [setPreferredExtension]
  )

  const handleSelectFirstWalletFromExtension = useCallback(
    async (source: string) => {
      const walletAccounts = await handleGetWalletFromExtension(source)
      if (!walletAccounts || walletAccounts.length === 0) return
      const mainAccount = walletAccounts.find((account) => account.source === source)
      if (mainAccount) changeAccount(mainAccount)
    },
    [handleGetWalletFromExtension, changeAccount]
  )

  const handleConnectToExtensionAndAccount = useCallback(
    async (address: string, source: string) => {
      const walletAccounts = await handleGetWalletFromExtension(source)
      if (!walletAccounts || walletAccounts.length === 0) return
      const mainAccount = walletAccounts.find((account) => account.address === address)
      if (mainAccount) changeAccount(mainAccount)
      sendGAEvent({
        event: 'wallet_auto_connect_account',
        value: `source:${source}`
      })
    },
    [handleGetWalletFromExtension, changeAccount]
  )

  useEffect(() => {
    // This effect is used to get the injector from the selected account
    // and is triggered when the accounts or the actingAccountIdx change
    const getInjector = async () => {
      const { web3FromSource } = await import('@polkadot/extension-dapp')

      if (actingAccount?.source) {
        try {
          const injector = await web3FromSource(actingAccount?.source)

          setInjector(injector)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setError(e)
        }
      }
    }

    getInjector()
  }, [actingAccount])

  useEffect(() => {
    setup()
  }, [injector, setup])

  useEffect(() => {
    if (!actingAccount && preferredExtension && preferredAccount)
      handleConnectToExtensionAndAccount(preferredAccount, preferredExtension)
  }, [actingAccount, preferredAccount, preferredExtension, handleConnectToExtensionAndAccount])

  return (
    <WalletContext.Provider
      value={{
        api,
        domainsApis,
        accounts,
        actingAccount,
        isReady,
        error,
        injector,
        disconnectWallet,
        extensions,
        setActingAccount,
        preferredExtension,
        setPreferredExtension,
        subspaceAccount,
        handleSelectFirstWalletFromExtension,
        changeAccount
      }}>
      {children}
    </WalletContext.Provider>
  )
}
