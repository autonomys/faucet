import { addressBook, ethers, network } from 'hardhat'

const SECONDS_BETWEEN_REQUEST = 60 * 60 * 24
const AMOUNT_BY_REQUEST = ethers.parseEther('0.2')

async function main() {
  const [deployer] = await ethers.getSigners()
  const deployerAddress = await deployer.getAddress()

  let faucetAddressIfDeployed: string | undefined = undefined
  faucetAddressIfDeployed = addressBook.retrieveContract('Faucet', network.name)
  if (network.name === 'localhost' || network.name === 'hardhat')
    faucetAddressIfDeployed = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  const faucet = await ethers.getContractAt('Faucet', faucetAddressIfDeployed, deployer)

  const lockTime = await faucet.lockTime()
  console.log('lockTime', lockTime.toString())

  const setLockTime = await faucet.setLockTime(SECONDS_BETWEEN_REQUEST)
  console.log('setLockTime txHash', setLockTime.hash)

  const receipt = await setLockTime.wait()
  console.log('receipt', receipt)

  const lockTimeFinal = await faucet.lockTime()
  console.log('lockTimeFinal', lockTimeFinal.toString())

  const withdrawalAmount = await faucet.withdrawalAmount()
  console.log('withdrawalAmount', withdrawalAmount.toString())

  const setWithdrawalAmount = await faucet.setWithdrawalAmount(AMOUNT_BY_REQUEST)
  console.log('setWithdrawalAmount txHash', setWithdrawalAmount.hash)

  const receipt2 = await setWithdrawalAmount.wait()
  console.log('receipt', receipt2)

  const withdrawalAmountFinal = await faucet.withdrawalAmount()
  console.log('withdrawalAmountFinal', withdrawalAmountFinal.toString())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
