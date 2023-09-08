import { ethers } from 'hardhat'
import { setup } from './utils/setup'

async function main() {
  const [deployer] = await ethers.getSigners()
  const deployerAddress = await deployer.getAddress()

  await setup(deployer, [deployerAddress])
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
