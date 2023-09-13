import { ethers, addressBook, network } from 'hardhat'

async function main() {
  const [deployer] = await ethers.getSigners()
  const deployerAddress = await deployer.getAddress()
  const deployerBalance = await deployer.provider.getBalance(deployerAddress)

  const AMOUNT_TO_FUND = ethers.parseEther('0.1')

  let faucetAddressIfDeployed: string | undefined = undefined
  faucetAddressIfDeployed = addressBook.retrieveContract('Faucet', network.name)
  if (network.name === 'localhost' || network.name === 'hardhat')
    faucetAddressIfDeployed = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const faucet = await ethers.getContractAt('Faucet', faucetAddressIfDeployed, deployer)
  const faucetName = await faucet.lockTime()

  if (deployerBalance > AMOUNT_TO_FUND && faucetName > 0) {
    if (faucetAddressIfDeployed) {
      const tx = await deployer.sendTransaction({
        to: faucetAddressIfDeployed,
        value: AMOUNT_TO_FUND,
      })
      console.log('Tx:', tx.hash)
      await tx.wait()
      console.log('Tx confirmed')
    } else {
      console.error('Faucet not deployed')
    }
  } else {
    console.error('Not enough funds')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
