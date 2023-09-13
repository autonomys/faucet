import { Signer } from 'ethers'
import { deploy as deployFaucet } from './Faucet'

export const setup = async (deployer: Signer, minterAddresses: string[], logAddress: boolean = true) => {
  const { faucet, faucetAddress } = await deployFaucet(deployer, logAddress)

  for (const minterAddress of minterAddresses) await faucet.connect(deployer).addMinter(minterAddress)

  return { faucet, faucetAddress }
}
