import { Signer } from 'ethers'
import { addressBook, ethers, network } from 'hardhat'

export const deploy = async (
  deployer: Signer,
  mockERC20Address: string,
  mockERC721Address: string,
  logAddress: boolean = true,
) => {
  const Faucet = await ethers.getContractFactory('Faucet')
  const faucet = await Faucet.deploy(mockERC20Address, mockERC721Address)

  await faucet.waitForDeployment()
  const faucetAddress = await faucet.getAddress()

  if (logAddress) {
    await addressBook.saveContract('Faucet', faucetAddress, network.name, await deployer.getAddress())

    console.log('Faucet deployed to:', faucetAddress)
  }

  return { faucet, faucetAddress }
}
