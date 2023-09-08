import { Signer } from 'ethers'
import { addressBook, ethers, network } from 'hardhat'

export const deploy = async (deployer: Signer, logAddress: boolean = true) => {
  const MockERC20 = await ethers.getContractFactory('MockERC20')
  const mockERC20 = await MockERC20.deploy()

  await mockERC20.waitForDeployment()
  const mockERC20Address = await mockERC20.getAddress()

  if (logAddress) {
    await addressBook.saveContract('MockERC20', mockERC20Address, network.name, await deployer.getAddress())

    console.log('MockERC20 deployed to:', mockERC20Address)
  }

  return { mockERC20, mockERC20Address }
}
