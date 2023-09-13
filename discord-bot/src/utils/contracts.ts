import { Wallet, Contract, providers, BigNumber, Transaction } from 'ethers'
import { config } from './config'
import { ABIS } from './abis'

const getProvider = async (): Promise<providers.JsonRpcProvider> => new providers.JsonRpcProvider(config.RPC_ENDPOINT)

const getFaucetWithProvider = async () => {
  const provider = await getProvider()
  return new Contract(config.CONTRACT_ADDRESS, ABIS.FAUCET, provider)
}

const getSigner = async (): Promise<Wallet> => {
  const provider = await getProvider()
  return new Wallet(config.PRIVATE_KEY, provider)
}

const getFaucetWithSigner = async () => {
  const signer = await getSigner()
  return new Contract(config.CONTRACT_ADDRESS, ABIS.FAUCET, signer)
}

const withdrawalAmount = async (): Promise<BigNumber> => {
  const contract = await getFaucetWithProvider()
  return await contract.withdrawalAmount()
}

const lockTime = async (): Promise<BigNumber> => {
  const contract = await getFaucetWithProvider()
  return await contract.lockTime()
}

const nextAccessTime = async (address: string): Promise<BigNumber> => {
  const contract = await getFaucetWithProvider()
  return await contract.nextAccessTime(address)
}

const requestTokens = async (address: string): Promise<Transaction> => {
  const contract = await getFaucetWithSigner()
  return await contract.requestTokens(address)
}

const verifyFaucetBalance = async (): Promise<BigNumber> => {
  const provider = await getProvider()
  return await provider.getBalance(config.CONTRACT_ADDRESS)
}

export const transactions = {
  requestTokens,
}

export const queries = {
  withdrawalAmount,
  lockTime,
  nextAccessTime,
  verifyFaucetBalance,
}
