import { addressBook, ethers, network } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  const deployerAddress = await deployer.getAddress()
  const deployerBalance = await deployer.provider.getBalance(deployerAddress)
  console.log('deployerBalance', deployerBalance)

  let faucetAddressIfDeployed: string | undefined = undefined
  faucetAddressIfDeployed = addressBook.retrieveContract('Faucet', network.name)
  if (network.name === 'localhost' || network.name === 'hardhat')
    faucetAddressIfDeployed = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const faucet = await ethers.getContractAt('Faucet', faucetAddressIfDeployed, deployer)

  const requestTokens = await faucet.requestTokens(deployerAddress)
  console.log('requestTokens txHash', requestTokens.hash)

  const receipt = await requestTokens.wait()
  console.log('receipt', receipt)

  const deployerBalanceFinal = await deployer.provider.getBalance(deployerAddress)
  console.log('deployerBalance', deployerBalanceFinal)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
