import { addressBook, ethers, network } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  const deployerAddress = await deployer.getAddress()

  let faucetAddressIfDeployed: string | undefined = undefined
  faucetAddressIfDeployed = addressBook.retrieveContract('Faucet', network.name)
  if (network.name === 'localhost' || network.name === 'hardhat')
    faucetAddressIfDeployed = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const faucet = await ethers.getContractAt('Faucet', faucetAddressIfDeployed, deployer)
  const addMinter = await faucet.addMinter(deployerAddress)
  console.log('addMinter txHash', addMinter.hash)

  const receipt = await addMinter.wait()
  console.log('receipt', receipt)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
