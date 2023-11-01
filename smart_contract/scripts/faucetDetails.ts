import { addressBook, ethers, network } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()

  let faucetAddressIfDeployed: string | undefined = undefined
  faucetAddressIfDeployed = addressBook.retrieveContract('Faucet', network.name)
  if (network.name === 'localhost' || network.name === 'hardhat')
    faucetAddressIfDeployed = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const faucet = await ethers.getContractAt('Faucet', faucetAddressIfDeployed, deployer)
  const lockTime = await faucet.lockTime()
  console.log('lockTime', lockTime.toString())

  const withdrawalAmount = await faucet.withdrawalAmount()
  console.log('withdrawalAmount', withdrawalAmount.toString())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
