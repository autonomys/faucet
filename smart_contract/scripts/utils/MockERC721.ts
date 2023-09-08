import { Signer } from 'ethers'
import { addressBook, ethers, network } from 'hardhat'

export const deploy = async (deployer: Signer, logAddress: boolean = true) => {
  const MockERC721 = await ethers.getContractFactory('MockERC721')
  const mockERC721 = await MockERC721.deploy()

  await mockERC721.waitForDeployment()
  const mockERC721Address = await mockERC721.getAddress()

  if (logAddress) {
    await addressBook.saveContract('MockERC721', mockERC721Address, network.name, await deployer.getAddress())

    console.log('MockERC721 deployed to:', mockERC721Address)
  }

  return { mockERC721, mockERC721Address }
}
