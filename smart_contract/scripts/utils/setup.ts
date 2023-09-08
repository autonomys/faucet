import { Signer } from 'ethers'
import { deploy as deployFaucet } from './Faucet'
import { deploy as deployMockERC20 } from './MockERC20'
import { deploy as deployMockERC721 } from './MockERC721'

export const setup = async (deployer: Signer, minterAddresses: string[], logAddress: boolean = true) => {
  const { mockERC20, mockERC20Address } = await deployMockERC20(deployer, logAddress)
  const { mockERC721, mockERC721Address } = await deployMockERC721(deployer, logAddress)

  const { faucet, faucetAddress } = await deployFaucet(deployer, mockERC20Address, mockERC721Address, logAddress)

  await mockERC20.connect(deployer).addFaucet(faucetAddress)
  await mockERC721.connect(deployer).addFaucet(faucetAddress)

  for (const minterAddress of minterAddresses) await faucet.connect(deployer).addMinter(minterAddress)

  return { faucet, faucetAddress, mockERC20, mockERC20Address, mockERC721, mockERC721Address }
}
